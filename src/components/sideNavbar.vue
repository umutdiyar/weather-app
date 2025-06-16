<template>
  <header class="fixed top-0 left-0 right-0 bg-weather-primary shadow-2xl">
    <nav class="flex justify-center items-center text-white py-6">
      <div class="flex justify-between items-center w-full max-w-screen-lg">
        <RouterLink :to="{ name: 'home' }">
          <div class="flex items-center space-x-4">
            <i class="fa-solid fa-cloud text-weather-secondary text-2xl"></i>
            <p class="text-2xl">Hava Durumu</p>
          </div>
        </RouterLink>

        <div class="flex items-center text-white space-x-4 text-xl">
          <i
            @click="toggleModal"
            class="fa-solid fa-circle-info hover:text-weather-secondary duration-150 cursor-pointer"
          ></i>
          <i class="fa-solid fa-plus hover:text-weather-secondary duration-150 cursor-pointer"></i>
        </div>
      </div>
    </nav>
  </header>

  <div class="flex items-center justify-center mt-14">
    <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
      <div class="text-black">
        <h1 class="text-2xl mb-1">Hakkında:</h1>
        <p class="mb-4">
          Yerel Hava Durumu, seçtiğiniz şehirlerin güncel ve gelecekteki hava durumunu takip
          etmenizi sağlar.
        </p>
        <h2 class="text-2xl">Nasıl Çalışır:</h2>
        <ol class="list-decimal list-inside">
          <li>Şehrinizin adını arama çubuğuna girerek arayın.</li>
          <li>
            Sonuçlar içerisinden bir şehir seçin, bu sizi seçtiğiniz şehrin güncel hava durumuna
            götürecektir.
          </li>
        </ol>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import BaseModal from './baseModal.vue';
import { ref } from 'vue';
const modalActive = ref(null);
const toggleModal = () => {
  modalActive.value = !modalActive.value;
};
</script>
