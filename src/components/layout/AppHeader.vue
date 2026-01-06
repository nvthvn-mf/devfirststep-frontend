<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
import { inject } from 'vue';

const { currentUser, logout } = useAuthStore();
const { currentPage, navigateTo } = inject('navigation');

// Fonction pour naviguer vers une page
const navigateToPage = (pageName) => {
  // Si nous naviguons vers une vue principale, désélectionner le projet
  if (pageName !== 'ProjectDetail') {
    navigateTo(pageName);
  } else {
    navigateTo(pageName);
  }
}
</script>

<template>
  <header class="bg-indigo-600 text-white shadow-md sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      <!-- Logo / Nom de l'app -->
      <div class="text-2xl font-bold cursor-pointer" @click="navigateToPage('Projects')">
        DevFirstStep
      </div>

      <nav v-if="currentUser" class="flex space-x-6 items-center">
        <!-- Navigation -->
        <NavItem label="Projets" pageName="Projects" :current="currentPage" @navigate="navigateToPage" />
        <NavItem label="Profil" pageName="Profile" :current="currentPage" @navigate="navigateToPage" />

        <!-- Infos utilisateur et Déconnexion -->
        <div class="flex items-center space-x-2 bg-indigo-700 px-3 py-1 rounded-full">
          <span class="text-sm font-medium">{{ currentUser.email }}</span>
          <button @click="logout" class="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded-full transition duration-150">
            Déconnexion
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Pour l'instant, pas de styles scoped additionnels */
</style>