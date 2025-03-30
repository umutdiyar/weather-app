<script setup>
import { RouterView } from 'vue-router'
import sideNavbar from './components/sideNavbar.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen font-sans bg-weather-primary">
    <sideNavbar />
    <RouterView />
  </div>
</template>
