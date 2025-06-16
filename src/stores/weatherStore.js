import { defineStore } from 'pinia';
import axios from 'axios';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weather: null,
    forecast: [],
    dateTime: '',
    errorMessage: '',
    timer: null,
  }),
  actions: {
    async fetchWeatherByCity(cityName, country) {
      try {
        this.errorMessage = '';
        this.weather = null;
        this.forecast = [];

        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        // Geo API
        const geoRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
          params: {
            q: `${cityName},${country}`,
            limit: 1,
            appid: apiKey,
          },
        });

        if (!geoRes.data.length) {
          this.errorMessage = 'Şehir bulunamadı!';
          return;
        }

        const city = geoRes.data[0];

        await this.fetchWeatherByCoords(city.lat, city.lon, city.name, city.country);
      } catch (err) {
        console.error(err);
        this.errorMessage = 'Hava durumu bilgisi alınamadı!';
      }
    },

    async fetchWeatherByCoords(lat, lon, cityName = '', country = '') {
      try {
        this.errorMessage = '';
        this.weather = null;
        this.forecast = [];

        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

        // Current weather
        const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            lat,
            lon,
            appid: apiKey,
            lang: 'tr',
            units: 'metric',
          },
        });

        this.weather = {
          city: cityName || weatherRes.data.name,
          country: country || weatherRes.data.sys.country,
          temp: weatherRes.data.main.temp,
          description: weatherRes.data.weather[0].description,
          icon: weatherRes.data.weather[0].icon.slice(0, 2) + 'd',
        };

        // Forecast
        const forecastRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            lat,
            lon,
            appid: apiKey,
            lang: 'tr',
            units: 'metric',
          },
        });

        const dailyData = {};

        forecastRes.data.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toISOString().split('T')[0];

          if (!dailyData[dayKey]) {
            dailyData[dayKey] = {
              min: item.main.temp_min,
              max: item.main.temp_max,
              icon: item.weather[0].icon.slice(0, 2) + 'd',
              description: item.weather[0].description,
            };
          } else {
            dailyData[dayKey].min = Math.min(dailyData[dayKey].min, item.main.temp_min);
            dailyData[dayKey].max = Math.max(dailyData[dayKey].max, item.main.temp_max);
          }
        });

        this.forecast = Object.entries(dailyData)
          .slice(0, 5)
          .map(([dateStr, data]) => ({
            date: new Date(dateStr),
            min: data.min,
            max: data.max,
            icon: data.icon,
            description: data.description,
          }));
      } catch (err) {
        console.error(err);
        this.errorMessage = 'Hava durumu bilgisi alınamadı!';
      }
    },

    startDateTimeUpdater() {
      this.updateDateTime();
      this.timer = setInterval(() => this.updateDateTime(), 1000);
    },

    stopDateTimeUpdater() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    updateDateTime() {
      const now = new Date();
      this.dateTime = now.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
  },
});
