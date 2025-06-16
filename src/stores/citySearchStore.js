import { defineStore } from 'pinia';
import axios from 'axios';

export const useCitySearchStore = defineStore('citySearch', {
  state: () => ({
    search: '',
    suggestions: [],
    errorMessage: '',
  }),
  actions: {
    async getCitySuggestions() {
      if (this.search.length < 2) {
        this.suggestions = [];
        this.errorMessage = '';
        return;
      }
      try {
        const { data } = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
          params: {
            q: this.search,
            limit: 5,
            appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
            lang: 'tr',
          },
        });
        if (data.length === 0) {
          this.suggestions = [];
          this.errorMessage = 'Aradığınız şehir bulunamadı!';
        } else {
          this.suggestions = data;
          this.errorMessage = '';
        }
      } catch (error) {
        console.error('Şehir arama hatası: ', error);
        this.errorMessage = 'Şehir arama hatası oluştu!';
      }
    },
    clearSuggestions() {
      this.suggestions = [];
      this.errorMessage = '';
    },
    async searchCityByName(cityName) {
      this.search = cityName;
      await this.getCitySuggestions();
    },
  },
});
