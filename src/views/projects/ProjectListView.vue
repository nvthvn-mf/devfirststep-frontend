<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';
import ProjectCard from '@/components/projects/ProjectCard.vue';
import ProjectCreationModal from '@/components/projects/ProjectCreationModal.vue';

const { api } = useAuthStore();
const router = useRouter();

// États de la vue
const projects = ref([]);
const loading = ref(true);
const error = ref(null);
const showCreationModal = ref(false);

// Récupération des projets via l'API
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

// Navigation vers le détail d'un projet via son ID
const goToProject = (projectId) => {
  router.push({ name: 'project-detail', params: { id: projectId } });
};

// Rafraîchir la liste après création
const handleProjectCreated = () => {
  fetchProjects();
};

onMounted(fetchProjects);
</script>

<template>
  <div class="p-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Mes Projets ({{ projects.length }})</h1>
        <p class="text-gray-500 mt-1">Gérez vos idées et suivez votre progression.</p>
      </div>

      <button
          @click="showCreationModal = true"
          class="inline-flex items-center px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-xl shadow-sm transition duration-200"
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
      <span class="text-lg font-medium">Chargement des projets...</span>
    </div>

    <div v-else-if="error" class="p-6 text-red-700 bg-red-50 rounded-xl border border-red-200">
      <p class="font-bold">Erreur :</p>
      <p>{{ error }}</p>
      <button @click="fetchProjects" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Réessayer</button>
    </div>

    <!-- Liste vide -->
    <div v-else-if="projects.length === 0" class="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 text-center">
      <p class="text-xl font-bold text-gray-800">Aucun projet trouvé</p>
      <button @click="showCreationModal = true" class="mt-4 text-indigo-600 font-bold hover:underline">
        Créer mon premier projet
      </button>
    </div>

    <!-- Grille des projets -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @click="goToProject(project.id)"
      />
    </div>

    <!-- Modal de création -->
    <ProjectCreationModal
        v-if="showCreationModal"
        @close="showCreationModal = false"
        @projectCreated="handleProjectCreated"
    />
  </div>
</template>