<template>
  <main class="container text-white mx-auto max-w-screen-lg px-4">
    <div class="pt-8 mb-8 relative">
      <!-- Arama kutusu -->
      <div class="relative z-0 w-full mb-5 group">
        <input
          type="text"
          v-model="search"
          @input="getCitySuggestions"
          @keyup.enter="onEnterPressed"
          autocomplete="off"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-weather-secondary focus:outline-none focus:ring-0 focus:border-weather-secondary peer"
          placeholder=" "
        />
        <label
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-weather-secondary peer-focus:dark:text-weather-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Şehir Ara
        </label>
      </div>

      <!-- Hata mesajı -->
      <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>

      <!-- Şehir önerileri -->
      <ul v-if="suggestions.length && !errorMessage" class="mt-2 rounded-xl">
        <li
          v-for="(city, index) in suggestions"
          :key="index"
          @click="selectCity(city)"
          class="py-2 hover:text-weather-app-to-secondary cursor-pointer flex justify-between items-center border-b border-gray-600"
        >
          {{ city.name }}, {{ city.country }}
        </li>
      </ul>

      <!-- Seçilen şehrin hava durumu -->
      <div
        v-if="weather"
        class="mt-6 p-6 rounded-xl shadow-md text-center bg-gray-800 bg-opacity-30 backdrop-blur"
      >
        <h2 class="text-xl font-semibold mb-2">{{ weather.city }}, {{ weather.country }}</h2>
        <p class="text-4xl font-bold">{{ Math.round(weather.temp) }}°C</p>
        <p class="capitalize text-gray-300 mt-1">{{ weather.description }}</p>
        <img
          :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`"
          :alt="weather.description"
          class="mx-auto mt-2"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCitySearchStore } from '@/stores/citySearchStore';
import { useWeatherStore } from '@/stores/weatherStore';

const citySearchStore = useCitySearchStore();
const weatherStore = useWeatherStore();
const router = useRouter();

const search = computed({
  get: () => citySearchStore.search,
  set: (val) => (citySearchStore.search = val),
});

const suggestions = computed(() => citySearchStore.suggestions);
const errorMessage = computed(() => citySearchStore.errorMessage || weatherStore.errorMessage);
const weather = computed(() => weatherStore.weather);

const getCitySuggestions = () => {
  citySearchStore.getCitySuggestions();
};

const selectCity = async (city) => {
  citySearchStore.clearSuggestions();
  await weatherStore.fetchWeatherByCoords(city.lat, city.lon, city.name, city.country);
  if (!weatherStore.errorMessage) {
    router.push(`/city/${city.name}/${city.country}`);
  }
};

// Enter tuşu ile arama
const onEnterPressed = async () => {
  if (!search.value) return;
  citySearchStore.clearSuggestions();
  await weatherStore.fetchWeatherByCity(search.value, '');
  if (!weatherStore.errorMessage && weatherStore.weather) {
    const city = weatherStore.weather;
    router.push(`/city/${city.city}/${city.country}`);
  }
};

onMounted(() => {
  weatherStore.weather = null;
  weatherStore.forecast = [];
  weatherStore.errorMessage = '';
  citySearchStore.search = '';
  citySearchStore.clearSuggestions();
});
</script>
