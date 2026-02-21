import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface Candidate {
  id: string;
  rating: number;
  availability: boolean;
  recentAssignments: number;
  skillMatch: number;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.json();
  const { taskId, category } = body as { taskId: string; category: string };

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: candidatesData, error: profileError } = await supabase
    .from('profiles')
    .select('id, rating, availability, user_skills(skill), task_assignment_history(count)')
    .eq('availability', true);

  if (profileError || !candidatesData) {
    return new Response(JSON.stringify({ error: profileError?.message ?? 'No candidates' }), { status: 400 });
  }

  const candidates: Candidate[] = candidatesData.map((row: any) => {
    const recentAssignments = row.task_assignment_history?.length ?? 0;
    const skills = (row.user_skills ?? []).map((item: { skill: string }) => item.skill.toLowerCase());
    return {
      id: row.id,
      rating: Number(row.rating ?? 5),
      availability: Boolean(row.availability),
      recentAssignments,
      skillMatch: skills.includes(category.toLowerCase()) ? 1 : 0
    };
  });

  const scored = candidates
    .map((candidate) => {
      const score =
        candidate.skillMatch * 40 +
        candidate.rating * 10 +
        (candidate.availability ? 10 : 0) -
        candidate.recentAssignments * 12;

      return { ...candidate, fairScore: score + Math.random() * 5 };
    })
    .sort((a, b) => b.fairScore - a.fairScore);

  const selected = scored[0];

  if (!selected) {
    return new Response(JSON.stringify({ error: 'Nenhum executor elegível encontrado' }), { status: 404 });
  }

  const { error: taskUpdateError } = await supabase
    .from('tasks')
    .update({ assigned_to: selected.id, status: 'assigned' })
    .eq('id', taskId);

  if (taskUpdateError) {
    return new Response(JSON.stringify({ error: taskUpdateError.message }), { status: 400 });
  }

  await supabase.from('task_assignment_history').insert({
    task_id: taskId,
    executor_id: selected.id,
    fair_score: selected.fairScore
  });

  return new Response(
    JSON.stringify({ assignedTo: selected.id, fairScore: selected.fairScore, reason: 'Distribuição automática rotativa aplicada.' }),
    { headers: { 'Content-Type': 'application/json' }, status: 200 }
  );
});
