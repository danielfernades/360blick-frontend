import { Colors } from '../constants/theme';

/**
 * Obter cor por categoria de serviço
 */
export const getCategoryColor = (category) => {
  switch (category) {
    case 'Premium':
      return Colors.premium;
    case 'Free':
      return Colors.free;
    case 'Freemium':
      return Colors.freemium;
    default:
      return Colors.textMuted;
  }
};

/**
 * Obter cor por gênero
 */
export const getGenreColor = (genre) => {
  const genreColorMap = {
    'Ação': Colors.action,
    'Aventura': Colors.adventure,
    'Comédia': Colors.comedy,
    'Drama': Colors.drama,
    'Ficção Científica': Colors.sciFi,
    'Horror': Colors.horror,
    'Fantasia': Colors.fantasy,
    'Romance': Colors.romance,
    'Thriller': Colors.thriller,
    'Animação': Colors.animation,
  };
  return genreColorMap[genre] || Colors.textMuted;
};

/**
 * Formatar números grandes (ex: 15000 -> 15k)
 */
export const formatLargeNumber = (number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(0) + 'k';
  }
  return number.toString();
};

/**
 * Formatar data para exibição
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Truncar texto com ellipsis
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalizar primeira letra
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Validar se URL é válida
 */
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Obter ícone para tipo de conteúdo
 */
export const getContentTypeIcon = (type) => {
  return type === 'movie' ? 'film' : 'tv';
};

/**
 * Obter texto do tipo de conteúdo
 */
export const getContentTypeText = (type) => {
  return type === 'movie' ? 'Filme' : 'Série';
};

/**
 * Gerar delay escalonado para animações
 */
export const getStaggeredDelay = (index, baseDelay = 100) => {
  return index * baseDelay;
};

/**
 * Filtrar array removendo duplicatas por ID
 */
export const removeDuplicatesById = (array) => {
  const seen = new Set();
  return array.filter(item => {
    const duplicate = seen.has(item.id);
    seen.add(item.id);
    return !duplicate;
  });
};

/**
 * Ordenar array por rating (descendente)
 */
export const sortByRating = (array) => {
  return [...array].sort((a, b) => b.rating - a.rating);
};

/**
 * Ordenar array por ano (descendente)
 */
export const sortByYear = (array) => {
  return [...array].sort((a, b) => b.year - a.year);
};

/**
 * Filtrar conteúdo por tipo
 */
export const filterContentByType = (content, type) => {
  if (type === 'all') return content;
  return content.filter(item => item.type === type);
};

/**
 * Buscar conteúdo por termo
 */
export const searchContent = (content, searchTerm) => {
  if (!searchTerm) return content;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return content.filter(item =>
    item.title.toLowerCase().includes(lowercaseSearch) ||
    item.genre.some(genre => genre.toLowerCase().includes(lowercaseSearch))
  );
};