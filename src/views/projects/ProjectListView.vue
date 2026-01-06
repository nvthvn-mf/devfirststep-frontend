<script setup>
import { ref, onMounted, inject } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import ProjectCard from '@/components/projects/ProjectCard.vue';
import ProjectCreationModal from '@/components/projects/ProjectCreationModal.vue';

const { api } = useAuthStore();
const { setSelectedProject } = inject('navigation');

// États de la vue
const projects = ref([]);
const loading = ref(true);
const error = ref(null);
const showCreationModal = ref(false); // État pour afficher/masquer le modal

// Fonction pour récupérer la liste des projets depuis l'API
const fetchProjects = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await api.get('projects');
    projects.value = data;
  } catch (err) {
    error.value = "Erreur lors du chargement des projets : " + err.message;
  } finally {
    loading.value = false;
  }
};

// Charger les projets au montage du composant
onMounted(fetchProjects);

// Gestionnaire après création réussie
const handleProjectCreated = () => {
  fetchProjects(); // Rafraîchir la liste
  // Le modal se ferme via l'événement 'close' émis par le composant modal
};
</script>

<template>
  <div class="p-8">
    <!-- En-tête de la page -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Mes Projets de Développement</h1>
        <p class="text-gray-500 mt-1">Gérez vos idées et suivez votre progression.</p>
      </div>

      <button
          @click="showCreationModal = true"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouveau Projet
      </button>
    </div>

    <!-- États de chargement et d'erreur -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-indigo-600">
      <svg class="animate-spin h-10 w-10 mb-3" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-lg font-medium">Récupération de vos projets...</span>
    </div>

    <div v-else-if="error" class="max-w-2xl mx-auto p-6 text-red-700 bg-red-50 rounded-xl border border-red-200 shadow-sm">
      <div class="flex items-center mb-3">
        <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="font-bold">Un problème est survenu</p>
      </div>
      <p>{{ error }}</p>
      <button @click="fetchProjects" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
        Réessayer
      </button>
    </div>

    <!-- Liste vide -->
    <div v-else-if="projects.length === 0" class="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 text-center px-4">
      <div class="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600">
        <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p class="text-xl font-bold text-gray-800">Aucun projet pour le moment</p>
      <p class="text-gray-500 mt-2 max-w-sm">Commencez par créer votre premier projet pour organiser votre roadmap de développement.</p>
      <button @click="showCreationModal = true" class="mt-6 text-indigo-600 font-bold hover:underline">
        Créer mon premier projet
      </button>
    </div>

    <!-- Grille des projets -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @click="setSelectedProject(project.id)"
      />
    </div>

    <!-- Modal de création (rendu conditionnel) -->
    <ProjectCreationModal
        v-if="showCreationModal"
        @close="showCreationModal = false"
        @projectCreated="handleProjectCreated"
    />
  </div>
</template>