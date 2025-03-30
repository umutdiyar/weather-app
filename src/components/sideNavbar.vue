<template>
  <header class="sticky top-0 bg-weather-primary shadow-lg py-4">
    <nav class="container flex mx-auto items-center justify-between max-w-2xl">
      <RouterLink :to="{ name: 'home' }" class="flex items-center space-x-2">
        <i class="fa-solid fa-sun text-white text-2xl"></i>
        <p class="text-white text-2xl">The Local Weather</p>
      </RouterLink>
      <div class="flex gap-3 items-end justify-end mr-0">
        <i
          class="fa-solid fa-circle-info text-white text-xl hover:text-gray-300 duration-150 cursor-pointer"
        ></i>
        <i
          class="fa-solid fa-plus text-white text-xl hover:text-gray-300 duration-150 cursor-pointer"
        ></i>
      </div>
    </nav>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router'
</script>

<style lang="scss" scoped></style>
