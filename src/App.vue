<script setup>
import { RouterView } from 'vue-router';
import sideNavbar from './components/sideNavbar.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen font-sans bg-weather-primary">
    <sideNavbar />

    <main class="flex-grow">
      <RouterView />
    </main>

    <footer class="bg-weather-primary border-t border-gray-800 py-4 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="text-gray-300 text-sm">
            © 2024 Made with created by
            <a
              href="https://github.com/umutdiyar"
              target="_blank"
              rel="noopener noreferrer"
              class="text-weather-secondary hover:text-weather-primary-hover font-medium transition-colors"
            >
              Umut Diyar Balcı
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
