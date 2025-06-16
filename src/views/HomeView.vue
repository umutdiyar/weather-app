<template>
  <main class="container text-white mx-auto max-w-screen-lg">
    <div class="pt-8 mb-8 relative">
      <div class="relative z-0 w-full mb-5 group">
        <input
          type="text"
          v-model="search"
          @input="getCitySuggestions"
          autocomplete="email"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-weather-secondary focus:outline-none focus:ring-0 focus:border-weather-secondary peer"
          placeholder=" "
        />
        <label
          for="floating_email"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-weather-secondary peer-focus:dark:text-weather-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Şehir Ara</label
        >
      </div>

      <!--❗ Hata Mesajı -->
      <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>

      <ul v-if="suggestions.length && !errorMessage" class="mt-2 rounded-xl">
        <li
          v-for="(city, index) in suggestions"
          :key="index"
          @click="selectCity(city)"
          class="py-2 hover:text-weather-app-to-secondary cursor-pointer flex justify-between items-center"
        >
          <div>{{ city.name }}, {{ city.country }}</div>
          <!-- Seçilen şehir için hava durumu -->
          <div v-if="weather" class="mt-6 p-6 rounded-xl shadow-md text-center">
            <h2 class="text-xl font-semibold mb-2">{{ weather.city }}, {{ weather.country }}</h2>
            <p class="text-4xl font-bold">{{ Math.round(weather.temp) }}°C</p>
            <p class="capitalize text-gray-600 mt-1">
              {{ weather.description }}
            </p>
            <img
              :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`"
              :alt="weather.description"
              class="mx-auto mt-2"
            />
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

const search = ref('');
const suggestions = ref([]);
const weather = ref(null);
const errorMessage = ref('');

const getCitySuggestions = async () => {
  if (search.value.length < 2) {
    suggestions.value = [];
    errorMessage.value = '';
    return;
  }
  try {
    const { data } = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: search.value,
        limit: 5,
        appid: apiKey,
        lang: 'tr',
      },
    });
    if (data.length === 0) {
      suggestions.value = [];
      errorMessage.value = 'Aradığınız şehir bulunamadı!';
    } else {
      suggestions.value = data;
      errorMessage.value = '';
    }
  } catch (error) {
    console.log('Şehir arama hatası: ', error);
  }
};

const selectCity = async (city) => {
  search.value = `${city.name}, ${city.country}`;
  suggestions.value = [];
  errorMessage.value = '';

  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: apiKey,
        lang: 'tr',
        units: 'metric',
      },
    });

    if (!data.main || !data.weather || !data.weather.length) {
      console.error('Beklenmeyen API yanıtı:', data);
      errorMessage.value = 'Beklenmeyen API yanıtı alındı!';
      return;
    }

    weather.value = {
      city: city.name,
      country: city.country,
      temp: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };

    await router.push({
      name: 'cityView',
      params: {
        state: city.country,
        city: city.name,
      },
    });
  } catch (error) {
    console.error('Hava durumu hatası:', error);
    errorMessage.value = 'Hava durumu bilgisi alınamadı!';
  }
};

console.log(apiKey);
</script>
