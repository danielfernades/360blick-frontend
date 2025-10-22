import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@user_profile';
const USER_SERVICES_KEY = '@user_services';
const USER_WATCHLIST_KEY = '@user_watchlist';

class UserService {
  
  // Obter perfil do usuário
  static async getUserProfile() {
    try {
      const profile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (profile) {
        return JSON.parse(profile);
      }
      return {
        name: 'Usuário',
        avatar: '👤',
        preferences: {
          favoriteGenres: [],
          preferredLanguage: 'pt-BR',
          contentType: 'both' // 'movies', 'series', 'both'
        },
        joinDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
  }

  // Salvar perfil do usuário
  static async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Erro ao salvar perfil do usuário:', error);
      return false;
    }
  }

  // Obter serviços do usuário
  static async getUserServices() {
    try {
      const services = await AsyncStorage.getItem(USER_SERVICES_KEY);
      if (services) {
        return JSON.parse(services);
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar serviços do usuário:', error);
      return [];
    }
  }

  // Adicionar serviço ao perfil do usuário
  static async addServiceToProfile(service) {
    try {
      const currentServices = await this.getUserServices();
      const serviceExists = currentServices.find(s => s.id === service.id);
      
      if (!serviceExists) {
        const updatedServices = [...currentServices, {
          ...service,
          addedDate: new Date().toISOString()
        }];
        await AsyncStorage.setItem(USER_SERVICES_KEY, JSON.stringify(updatedServices));
        return true;
      }
      return false; // Serviço já existe
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      return false;
    }
  }

  // Remover serviço do perfil do usuário
  static async removeServiceFromProfile(serviceId) {
    try {
      const currentServices = await this.getUserServices();
      const updatedServices = currentServices.filter(s => s.id !== serviceId);
      await AsyncStorage.setItem(USER_SERVICES_KEY, JSON.stringify(updatedServices));
      return true;
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      return false;
    }
  }

  // Verificar se um serviço está no perfil do usuário
  static async isServiceInProfile(serviceId) {
    try {
      const services = await this.getUserServices();
      return services.some(s => s.id === serviceId);
    } catch (error) {
      console.error('Erro ao verificar serviço:', error);
      return false;
    }
  }

  // Obter lista de filmes/séries para assistir
  static async getWatchlist() {
    try {
      const watchlist = await AsyncStorage.getItem(USER_WATCHLIST_KEY);
      if (watchlist) {
        return JSON.parse(watchlist);
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar watchlist:', error);
      return [];
    }
  }

  // Adicionar item à watchlist
  static async addToWatchlist(content) {
    try {
      const currentWatchlist = await this.getWatchlist();
      const contentExists = currentWatchlist.find(c => c.id === content.id);
      
      if (!contentExists) {
        const updatedWatchlist = [...currentWatchlist, {
          ...content,
          addedDate: new Date().toISOString()
        }];
        await AsyncStorage.setItem(USER_WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
        return true;
      }
      return false; // Conteúdo já existe
    } catch (error) {
      console.error('Erro ao adicionar à watchlist:', error);
      return false;
    }
  }

  // Remover item da watchlist
  static async removeFromWatchlist(contentId) {
    try {
      const currentWatchlist = await this.getWatchlist();
      const updatedWatchlist = currentWatchlist.filter(c => c.id !== contentId);
      await AsyncStorage.setItem(USER_WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
      return true;
    } catch (error) {
      console.error('Erro ao remover da watchlist:', error);
      return false;
    }
  }

  // Verificar se um conteúdo está na watchlist
  static async isInWatchlist(contentId) {
    try {
      const watchlist = await this.getWatchlist();
      return watchlist.some(c => c.id === contentId);
    } catch (error) {
      console.error('Erro ao verificar watchlist:', error);
      return false;
    }
  }

  // Obter estatísticas do usuário
  static async getUserStats() {
    try {
      const services = await this.getUserServices();
      const watchlist = await this.getWatchlist();
      
      const totalMovies = watchlist.filter(c => c.type === 'movie').length;
      const totalSeries = watchlist.filter(c => c.type === 'series').length;
      
      const servicesByCategory = services.reduce((acc, service) => {
        acc[service.category] = (acc[service.category] || 0) + 1;
        return acc;
      }, {});

      return {
        totalServices: services.length,
        totalWatchlistItems: watchlist.length,
        totalMovies,
        totalSeries,
        servicesByCategory,
        joinDate: (await this.getUserProfile())?.joinDate
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return null;
    }
  }

  // Limpar todos os dados do usuário
  static async clearUserData() {
    try {
      await AsyncStorage.multiRemove([
        USER_PROFILE_KEY,
        USER_SERVICES_KEY,
        USER_WATCHLIST_KEY
      ]);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error);
      return false;
    }
  }
}

export default UserService;