import { create } from 'zustand';
import api from '../utils/api';

const usePortfolioStore = create((set, get) => ({
  portfolio: null,
  loading: false,
  saving: false,
  error: null,

  fetchPortfolio: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/portfolio/me');
      set({ portfolio: data.portfolio, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error, loading: false });
    }
  },

  updatePortfolio: async (updates) => {
    set({ saving: true });
    try {
      const { data } = await api.put('/portfolio/me', updates);
      set({ portfolio: data.portfolio, saving: false });
      return data.portfolio;
    } catch (err) {
      set({ saving: false });
      throw err;
    }
  },

  publishPortfolio: async () => {
    const { data } = await api.post('/portfolio/publish');
    set((state) => ({
      portfolio: { ...state.portfolio, isPublished: true, slug: data.slug, liveUrl: data.liveUrl },
    }));
    return data;
  },

  setPortfolio: (portfolio) => set({ portfolio }),
}));

export default usePortfolioStore;
