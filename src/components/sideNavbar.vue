<template>
  <header class="fixed top-0 left-0 right-0 bg-weather-primary shadow-2xl">
    <nav class="flex justify-center items-center text-white py-6">
      <div class="flex justify-between items-center w-full max-w-screen-lg">
        <RouterLink :to="{ name: 'home' }">
          <div class="flex items-center space-x-4">
            <i class="fa-solid fa-sun text-2xl"></i>
            <p class="text-2xl">The Local Weather</p>
          </div>
        </RouterLink>

        <div class="flex items-center text-white space-x-4 text-xl">
          <i
            class="fa-solid fa-circle-info hover:text-weather-secondary duration-150 cursor-pointer"
          ></i>
          <i class="fa-solid fa-plus hover:text-weather-secondary duration-150 cursor-pointer"></i>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import BaseModal from './baseModal.vue'
</script>

<style lang="scss" scoped></style>
