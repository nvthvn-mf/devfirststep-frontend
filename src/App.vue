<script setup>
import { ref, onMounted, computed, provide, watch } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

// Importation des vues et composants
// Vues d'authentification
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
// Composants de Layout
import AppHeader from '@/components/layout/AppHeader.vue';
// Vues Protégées (à créer, mais importées pour la compilation)
import ProjectListView from '@/views/projects/ProjectListView.vue';
import ProfileView from '@/views/user/ProfileView.vue';
import ProjectDetailView from '@/views/projects/ProjectDetailView.vue';


// --- GESTION DE L'ÉTAT ET DE L'AUTH (STORE) ---
const authStore = useAuthStore();
const { isAuthenticated, isLoading, loadProfile } = authStore;

// --- GESTION DE LA NAVIGATION (ROUTAGE SIMPLE) ---
const currentPage = ref('Projects');
const authView = ref('login'); // 'login' ou 'register'
const selectedProjectId = ref(null); // ID du projet sélectionné

// Fournit le store d'authentification pour toute l'application
// C'est l'équivalent du React Context
provide('auth', authStore);

// Fournit les états et méthodes de navigation
provide('navigation', {
  currentPage,
  authView,
  selectedProjectId,
  navigateTo: (page) => {
    currentPage.value = page;
    selectedProjectId.value = null; // Réinitialiser l'ID si on revient à la liste
  },
  setSelectedProject: (projectId) => {
    selectedProjectId.value = projectId;
    if (projectId) {
      currentPage.value = 'ProjectDetail'; // Navigation automatique vers le détail
    } else {
      currentPage.value = 'Projects';
    }
  },
});

// Le composant s'appelle toujours App
onMounted(() => {
  loadProfile();
});

// Recharger le profil si on passe d'une session non authentifiée à authentifiée
watch(isAuthenticated, (isAuth) => {
  if (isAuth && !authStore.currentUser.value) {
    loadProfile();
  }
});

// Mappe l'ID du projet sélectionné à la page détaillée ou à la liste
const currentProtectedView = computed(() => {
  if (selectedProjectId.value && currentPage.value === 'ProjectDetail') {
    return 'ProjectDetail';
  }
  switch (currentPage.value) {
    case 'Profile': return 'Profile';
    case 'Projects':
    default: return 'Projects';
  }
});

</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-screen bg-gray-50">
    <p class="text-xl font-semibold text-indigo-600">Chargement de DevFirstStep...</p>
  </div>

  <div v-else-if="!isAuthenticated" class="flex flex-col min-h-screen bg-gray-50 font-sans">
    <header class="bg-indigo-600 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-2xl font-bold">DevFirstStep</div>
    </header>
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
      <LoginView v-if="authView === 'login'" @switch-view="authView = $event" />
      <RegisterView v-else @switch-view="authView = $event" />
    </main>
    <footer class="bg-gray-800 text-white text-center py-4">
      © {{ new Date().getFullYear() }} DevFirstStep. Propulsé par Spring Boot & Vue.js.
    </footer>
  </div>

  <div v-else class="flex flex-col min-h-screen bg-gray-50 font-sans">
    <AppHeader />
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Routage Protégé -->
      <ProjectDetailView
          v-if="currentProtectedView === 'ProjectDetail'"
          :projectId="selectedProjectId"
          @backToList="setSelectedProject(null)"
      />
      <ProfileView v-else-if="currentProtectedView === 'Profile'" />
      <ProjectListView v-else-if="currentProtectedView === 'Projects'" />

      <!-- Fallback -->
      <div v-else class="text-center p-10 text-gray-500">Page non trouvée.</div>
    </main>
    <footer class="bg-gray-800 text-white text-center py-4">
      © {{ new Date().getFullYear() }} DevFirstStep. Propulsé par Spring Boot & Vue.js.
    </footer>
  </div>
</template>

<style>

</style>