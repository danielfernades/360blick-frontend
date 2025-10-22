// Simulação de sites de streaming populares (em um app real, isso viria de uma API)
const AVAILABLE_STREAMING_SERVICES = [
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'Filmes e séries originais',
    icon: '🎬',
    color: '#E50914',
    url: 'https://www.netflix.com',
    category: 'Premium',
    rating: 4.5,
    content: {
      movies: 15000,
      series: 3000,
      originals: 2500
    }
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime Video',
    description: 'Conteúdo original e filmes populares',
    icon: '📺',
    color: '#00A8E1',
    url: 'https://www.primevideo.com',
    category: 'Premium',
    rating: 4.3,
    content: {
      movies: 12000,
      series: 2500,
      originals: 1800
    }
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    description: 'Disney, Marvel, Star Wars e mais',
    icon: '🏰',
    color: '#113CCF',
    url: 'https://www.disneyplus.com',
    category: 'Premium',
    rating: 4.7,
    content: {
      movies: 8000,
      series: 1500,
      originals: 1200
    }
  },
  {
    id: 'hbo-max',
    name: 'HBO Max',
    description: 'Séries premium e blockbusters',
    icon: '🎭',
    color: '#A020F0',
    url: 'https://www.hbomax.com',
    category: 'Premium',
    rating: 4.4,
    content: {
      movies: 10000,
      series: 2000,
      originals: 1500
    }
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Filmes gratuitos e pagos',
    icon: '📹',
    color: '#FF0000',
    url: 'https://www.youtube.com',
    category: 'Freemium',
    rating: 4.0,
    content: {
      movies: 50000,
      series: 5000,
      originals: 800
    }
  },
  {
    id: 'pluto-tv',
    name: 'Pluto TV',
    description: 'TV e filmes gratuitos',
    icon: '📡',
    color: '#FF6B00',
    url: 'https://pluto.tv',
    category: 'Free',
    rating: 3.8,
    content: {
      movies: 8000,
      series: 1200,
      originals: 300
    }
  },
  {
    id: 'tubi',
    name: 'Tubi',
    description: 'Filmes e séries gratuitos',
    icon: '🎞️',
    color: '#FA541C',
    url: 'https://tubitv.com',
    category: 'Free',
    rating: 3.9,
    content: {
      movies: 20000,
      series: 1800,
      originals: 200
    }
  },
  {
    id: 'crackle',
    name: 'Crackle',
    description: 'Filmes e séries Sony gratuitos',
    icon: '⚡',
    color: '#FFA500',
    url: 'https://www.crackle.com',
    category: 'Free',
    rating: 3.6,
    content: {
      movies: 5000,
      series: 800,
      originals: 150
    }
  }
];

// Simulação de filmes e séries populares
const POPULAR_CONTENT = [
  {
    id: '1',
    title: 'Stranger Things',
    type: 'series',
    poster: 'https://via.placeholder.com/300x450/FF6B6B/FFFFFF?text=Stranger+Things',
    rating: 8.7,
    year: 2016,
    genre: ['Ficção Científica', 'Drama', 'Horror'],
    availableOn: ['netflix']
  },
  {
    id: '2',
    title: 'The Mandalorian',
    type: 'series',
    poster: 'https://via.placeholder.com/300x450/113CCF/FFFFFF?text=The+Mandalorian',
    rating: 8.8,
    year: 2019,
    genre: ['Ficção Científica', 'Aventura'],
    availableOn: ['disney-plus']
  },
  {
    id: '3',
    title: 'Avengers: Endgame',
    type: 'movie',
    poster: 'https://via.placeholder.com/300x450/A020F0/FFFFFF?text=Avengers+Endgame',
    rating: 8.4,
    year: 2019,
    genre: ['Ação', 'Aventura', 'Ficção Científica'],
    availableOn: ['disney-plus', 'amazon-prime']
  },
  {
    id: '4',
    title: 'The Boys',
    type: 'series',
    poster: 'https://via.placeholder.com/300x450/00A8E1/FFFFFF?text=The+Boys',
    rating: 8.7,
    year: 2019,
    genre: ['Ação', 'Comédia', 'Drama'],
    availableOn: ['amazon-prime']
  },
  {
    id: '5',
    title: 'Game of Thrones',
    type: 'series',
    poster: 'https://via.placeholder.com/300x450/A020F0/FFFFFF?text=Game+of+Thrones',
    rating: 9.3,
    year: 2011,
    genre: ['Drama', 'Fantasia', 'Aventura'],
    availableOn: ['hbo-max']
  },
  {
    id: '6',
    title: 'Spider-Man: No Way Home',
    type: 'movie',
    poster: 'https://via.placeholder.com/300x450/FF0000/FFFFFF?text=Spider-Man+NWH',
    rating: 8.2,
    year: 2021,
    genre: ['Ação', 'Aventura', 'Ficção Científica'],
    availableOn: ['youtube', 'amazon-prime']
  }
];

class StreamingService {
  
  // Buscar todos os serviços de streaming disponíveis
  static async getAvailableServices() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(AVAILABLE_STREAMING_SERVICES);
      }, 1000);
    });
  }

  // Buscar serviços por categoria
  static async getServicesByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = AVAILABLE_STREAMING_SERVICES.filter(
          service => service.category === category
        );
        resolve(filtered);
      }, 500);
    });
  }

  // Buscar conteúdo popular
  static async getPopularContent() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(POPULAR_CONTENT);
      }, 800);
    });
  }

  // Buscar conteúdo por serviço
  static async getContentByService(serviceId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = POPULAR_CONTENT.filter(
          content => content.availableOn.includes(serviceId)
        );
        resolve(filtered);
      }, 600);
    });
  }

  // Buscar conteúdo por termo
  static async searchContent(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = POPULAR_CONTENT.filter(
          content => 
            content.title.toLowerCase().includes(query.toLowerCase()) ||
            content.genre.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(filtered);
      }, 400);
    });
  }

  // Buscar serviços por termo
  static async searchServices(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = AVAILABLE_STREAMING_SERVICES.filter(
          service => 
            service.name.toLowerCase().includes(query.toLowerCase()) ||
            service.description.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 400);
    });
  }

  // Obter detalhes de um serviço específico
  static async getServiceDetails(serviceId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const service = AVAILABLE_STREAMING_SERVICES.find(s => s.id === serviceId);
        if (service) {
          const content = POPULAR_CONTENT.filter(
            content => content.availableOn.includes(serviceId)
          );
          resolve({
            ...service,
            availableContent: content
          });
        } else {
          resolve(null);
        }
      }, 600);
    });
  }

  // Obter detalhes de conteúdo específico
  static async getContentDetails(contentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const content = POPULAR_CONTENT.find(c => c.id === contentId);
        if (content) {
          const services = content.availableOn.map(serviceId => 
            AVAILABLE_STREAMING_SERVICES.find(s => s.id === serviceId)
          );
          resolve({
            ...content,
            services
          });
        } else {
          resolve(null);
        }
      }, 500);
    });
  }
}

export default StreamingService;