<script setup>
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import AppHeader from '@/components/layout/AppHeader.vue';

const authStore = useAuthStore();

// Note : On ne fait plus l'appel ici, c'est le Router qui va s'en charger
// pour garantir que l'auth est vérifiée AVANT d'afficher la page.
</script>

<template>
  <!-- FIX : Utilisation de .value pour accéder à la valeur réelle de la ref -->
  <div v-if="authStore.isLoading.value" class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center">
      <p class="text-xl font-semibold text-indigo-600 mb-2">Chargement...</p>
      <p class="text-sm text-gray-500">Vérification de la session</p>
    </div>
  </div>

  <div v-else class="flex flex-col min-h-screen bg-gray-50 font-sans">

    <!-- FIX : .value ici aussi -->
    <AppHeader v-if="authStore.isAuthenticated.value" />

    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <RouterView />
    </main>

    <footer class="bg-gray-800 text-white text-center py-4">
      © {{ new Date().getFullYear() }} DevFirstStep. Propulsé par Spring Boot & Vue.js.
    </footer>
  </div>
</template>

<style>
body {
  @apply bg-gray-50 font-sans;
}
</style>