import network from '@/config/network.config';
import apis from './apis';

const dashboardService = {
  getStats: async () => {
    try {
      const response = await network.get(apis.dashboardStats);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

export default dashboardService;
