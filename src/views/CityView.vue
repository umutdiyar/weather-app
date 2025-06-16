<template>
  <div class="container mx-auto max-w-screen-lg text-white">
    <div v-if="errorMessage" class="text-red-500 text-center mt-6">{{ errorMessage }}</div>

    <div v-else-if="weather" class="mt-6 p-6 rounded-xl text-center">
      <h2 class="text-xl font-semibold mb-1">{{ weather.city }}, {{ weather.country }}</h2>
      <p class="text-sm text-gray-400 mb-4">{{ dateTime }}</p>

      <p class="text-6xl font-bold mb-4">{{ Math.round(weather.temp) }}°C</p>

      <!-- Hava durumu açıklaması -->
      <p class="capitalize text-gray-300 text-xl mb-3">{{ weather.description }}</p>

      <!-- Hava durumu ikonu -->
      <img
        v-if="weather.icon"
        :src="`https://openweathermap.org/img/wn/${weather.icon.slice(0, 2)}d@2x.png`"
        :alt="weather.description"
        class="mx-auto"
      />
    </div>

    <div
      v-if="forecast.length"
      class="mt-6 overflow-x-auto scrollbar-hide flex items-center justify-center py-2"
    >
      <div class="flex space-x-4 px-2">
        <div
          v-for="(day, index) in forecast"
          :key="index"
          style="background-color: #042940; box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.1)"
          class="min-w-[160px] cursor-pointer bg-opacity-20 backdrop-blur-md rounded-lg p-6 flex flex-col items-center flex-shrink-0"
        >
          <p class="font-semibold mb-2 text-white">
            {{
              day.date.toLocaleDateString('tr-TR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })
            }}
          </p>
          <img
            :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
            :alt="day.description"
            class="w-16 h-16 mb-2"
          />
          <p class="capitalize text-sm mb-1 text-white">{{ day.description }}</p>
          <p class="text-sm text-white">
            <span class="font-bold text-red-500">{{ Math.round(day.max) }}°C</span> /
            <span class="font-light text-blue-300">{{ Math.round(day.min) }}°C</span>
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-6">Yükleniyor...</div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

const weather = ref(null);
const errorMessage = ref('');
const dateTime = ref('');
const forecast = ref([]);

const fetchWeather = async () => {
  try {
    const cityName = route.params.city;
    const country = route.params.state;

    const geoRes = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: `${cityName},${country}`,
        limit: 1,
        appid: apiKey,
      },
    });

    if (!geoRes.data.length) {
      errorMessage.value = 'Şehir bulunamadı!';
      return;
    }

    const city = geoRes.data[0];

    const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: apiKey,
        lang: 'tr',
        units: 'metric',
      },
    });

    weather.value = {
      city: city.name,
      country: city.country,
      temp: weatherRes.data.main.temp,
      description: weatherRes.data.weather[0].description,
      icon: weatherRes.data.weather[0].icon.slice(0, 2) + 'd',
    };

    // 5 günlük / 3 saatlik tahmin
    const forecastRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: apiKey,
        lang: 'tr',
        units: 'metric',
      },
    });

    const dailyData = {};

    forecastRes.data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0]; // yyyy-mm-dd

      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          min: item.main.temp_min,
          max: item.main.temp_max,
          icon: item.weather[0].icon.slice(0, 2) + 'd',
          description: item.weather[0].description,
          count: 1,
        };
      } else {
        dailyData[dayKey].min = Math.min(dailyData[dayKey].min, item.main.temp_min);
        dailyData[dayKey].max = Math.max(dailyData[dayKey].max, item.main.temp_max);
        dailyData[dayKey].count++;
      }
    });

    forecast.value = Object.entries(dailyData)
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
    errorMessage.value = 'Hava durumu bilgisi alınamadı!';
  }
};

const updateDateTime = () => {
  const now = new Date();
  dateTime.value = now.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

onMounted(() => {
  fetchWeather();

  updateDateTime();
  const timer = setInterval(updateDateTime, 1000);
  onUnmounted(() => clearInterval(timer));
});
</script>
