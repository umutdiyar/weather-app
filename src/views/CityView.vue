<template>
  <div class="container mx-auto max-w-screen-lg text-white">
    <div v-if="store.errorMessage" class="text-red-500 text-center mt-6">
      {{ store.errorMessage }}
    </div>

    <div v-else-if="store.weather" class="mt-6 p-6 rounded-xl text-center">
      <button
        @click="goBack"
        type="button"
        class="px-3 py-2 text-sm font-medium text-center inline-flex items-center border-indigo-700 border text-indigo-700 hover:bg-indigo-700 hover:text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3 me-2 transition-colors duration-200 ease-in-out"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <path
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
          />
        </svg>
        Geri Dön
      </button>
      <h2 class="text-xl font-semibold mb-1">
        {{ store.weather.city }}, {{ store.weather.country }}
      </h2>
      <p class="text-sm text-gray-400 mb-4">{{ store.dateTime }}</p>

      <p class="text-6xl font-bold mb-4">{{ Math.round(store.weather.temp) }}°C</p>

      <!-- Hava durumu açıklaması -->
      <p class="capitalize text-gray-300 text-xl mb-3">{{ store.weather.description }}</p>

      <!-- Hava durumu ikonu -->
      <img
        v-if="store.weather && store.weather.icon"
        :src="`https://openweathermap.org/img/wn/${store.weather.icon.slice(0, 2)}d@2x.png`"
        :alt="store.weather.description"
        class="mx-auto"
      />
    </div>

    <div
      v-if="store.forecast.length"
      class="mt-6 overflow-x-auto scrollbar-hide flex items-center justify-center py-2"
    >
      <div class="flex space-x-4 px-2">
        <div
          v-for="(day, index) in store.forecast"
          :key="index"
          style="background-color: #042940; box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.1)"
          class="min-w-[160px] hover:bg-weather-primary-hover cursor-pointer bg-opacity-20 backdrop-blur-md rounded-lg p-6 flex flex-col items-center flex-shrink-0"
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
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useWeatherStore } from '@/stores/weatherStore';
import router from '@/router';

const route = useRoute();
const store = useWeatherStore();

onMounted(() => {
  store.fetchWeatherByCity(route.params.city, route.params.country);
  store.startDateTimeUpdater();
});

onUnmounted(() => {
  store.stopDateTimeUpdater();
});

const goBack = () => {
  router.back();
};
</script>
