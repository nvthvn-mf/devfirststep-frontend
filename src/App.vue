<script setup>
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import AppHeader from '@/components/layout/AppHeader.vue';

const authStore = useAuthStore();
const route = useRoute();

onMounted(() => {
  authStore.loadProfile();
});
</script>

<template>
  <!-- Le Header ne s'affiche que si on n'est pas sur les pages de login/register -->
  <!-- On vérifie via le nom de la route ou l'état d'auth -->
  <div v-if="authStore.isLoading" class="flex items-center justify-center min-h-screen bg-gray-50">
    <p class="text-xl font-semibold text-indigo-600">Chargement...</p>
  </div>

  <div v-else class="flex flex-col min-h-screen bg-gray-50 font-sans">

    <!-- Header affiché seulement si authentifié -->
    <AppHeader v-if="authStore.isAuthenticated" />

    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- C'est ici que Vue Router injecte le composant de la page actuelle -->
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