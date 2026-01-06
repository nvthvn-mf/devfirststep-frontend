<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

// On reçoit l'ID du projet via props depuis App.vue
const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  }
});

const emit = defineEmits(['backToList']);
const { api } = useAuthStore();

// État local de la vue
const project = ref(null);
const tasks = ref([]);
const stats = ref(null);
const loading = ref(true);
const error = ref(null);

// Fonctions de récupération des données
const fetchProjectData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // 1. Récupérer les détails du projet
    const projectData = await api.get(`projects/${props.projectId}`);
    project.value = projectData;

    // 2. Récupérer les tâches (Kanban)
    const tasksData = await api.get(`projects/${props.projectId}/tasks`);
    tasks.value = tasksData;

    // 3. Récupérer les statistiques
    const statsData = await api.get(`dashboard/projects/${props.projectId}/stats`);
    stats.value = statsData;

  } catch (err) {
    error.value = "Erreur lors du chargement du projet: " + err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProjectData);

// Calcul des tâches pour les colonnes Kanban (simple regroupement pour l'affichage)
const tasksByStatus = computed(() => {
  return {
    TO_DO: tasks.value.filter(t => t.status === 'TO_DO'),
    IN_PROGRESS: tasks.value.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.value.filter(t => t.status === 'DONE'),
  };
});

// Helper pour le style des statuts
const getStatusBadge = (status) => {
  switch (status) {
    case 'TO_DO': return 'bg-gray-200 text-gray-800';
    case 'IN_PROGRESS': return 'bg-orange-100 text-orange-700';
    case 'DONE': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-500';
  }
};
</script>

<template>
  <div class="p-8">
    <button @click="$emit('backToList')"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 mb-6 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Retour aux projets
    </button>

    <div v-if="loading" class="text-center p-20 text-xl font-semibold text-indigo-600">Chargement du projet...</div>

    <div v-else-if="error" class="text-center p-20 text-red-700 bg-red-100 rounded-xl border border-red-300">
      <h2 class="text-2xl font-bold mb-3">Erreur de chargement</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="project" class="space-y-10">
      <!-- HEADER ET INFOS PROJET -->
      <div class="bg-white p-8 rounded-xl shadow-lg border-t-4 border-indigo-600">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ project.name }}</h1>
        <p class="text-gray-500 mb-6">Créé par: {{ project.ownerEmail }} le {{ new Date(project.createdAt).toLocaleDateString() }}</p>

        <h2 class="text-xl font-semibold text-indigo-600 mb-2">Objectifs :</h2>
        <p class="text-gray-700 mb-6 whitespace-pre-line">{{ project.objectives || 'Non spécifiés.' }}</p>

        <h2 class="text-xl font-semibold text-indigo-600 mb-2">Stacks :</h2>
        <div class="flex flex-wrap gap-2">
                    <span v-for="stack in project.stacks" :key="stack" class="px-3 py-1 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-full shadow-sm">
                        {{ stack }}
                    </span>
        </div>
      </div>

      <!-- DASHBOARD (STATISTIQUES) -->
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-indigo-500">
          <h3 class="text-5xl font-extrabold text-indigo-600 mb-1">{{ stats.completionPercentage }}%</h3>
          <p class="text-gray-500 font-semibold">Complété</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-gray-300">
          <h3 class="text-3xl font-bold text-gray-800">{{ stats.totalTasks }}</h3>
          <p class="text-gray-500">Tâches totales</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-orange-500">
          <h3 class="text-3xl font-bold text-gray-800">{{ stats.inProgressCount }}</h3>
          <p class="text-gray-500">En cours</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-green-500">
          <h3 class="text-3xl font-bold text-gray-800">{{ stats.doneCount }}</h3>
          <p class="text-gray-500">Terminé</p>
        </div>
      </div>

      <!-- KANBAN BOARD -->
      <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Tableau Kanban</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Colonne À FAIRE -->
          <div class="bg-gray-100 p-4 rounded-xl shadow-inner">
            <h3 class="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">À FAIRE ({{ tasksByStatus.TO_DO.length }})</h3>
            <div v-if="tasksByStatus.TO_DO.length === 0" class="text-sm text-gray-500 p-4 text-center">Rien à faire.</div>
            <div v-for="task in tasksByStatus.TO_DO" :key="task.id" class="bg-white p-3 rounded-lg shadow-sm mb-3 border-l-4 border-gray-400">
              <p class="font-medium text-gray-800">{{ task.title }}</p>
              <span :class="['text-xs mt-1 inline-block px-2 py-0.5 rounded-full', getStatusBadge(task.status)]">{{ task.status.replace('_', ' ') }}</span>
            </div>
          </div>

          <!-- Colonne EN COURS -->
          <div class="bg-gray-100 p-4 rounded-xl shadow-inner">
            <h3 class="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">EN COURS ({{ tasksByStatus.IN_PROGRESS.length }})</h3>
            <div v-if="tasksByStatus.IN_PROGRESS.length === 0" class="text-sm text-gray-500 p-4 text-center">Rien en cours.</div>
            <div v-for="task in tasksByStatus.IN_PROGRESS" :key="task.id" class="bg-white p-3 rounded-lg shadow-sm mb-3 border-l-4 border-orange-500">
              <p class="font-medium text-gray-800">{{ task.title }}</p>
              <span :class="['text-xs mt-1 inline-block px-2 py-0.5 rounded-full', getStatusBadge(task.status)]">{{ task.status.replace('_', ' ') }}</span>
            </div>
          </div>

          <!-- Colonne TERMINÉ -->
          <div class="bg-gray-100 p-4 rounded-xl shadow-inner">
            <h3 class="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">TERMINÉ ({{ tasksByStatus.DONE.length }})</h3>
            <div v-if="tasksByStatus.DONE.length === 0" class="text-sm text-gray-500 p-4 text-center">Rien de terminé.</div>
            <div v-for="task in tasksByStatus.DONE" :key="task.id" class="bg-white p-3 rounded-lg shadow-sm mb-3 border-l-4 border-green-500">
              <p class="font-medium text-gray-800">{{ task.title }}</p>
              <span :class="['text-xs mt-1 inline-block px-2 py-0.5 rounded-full', getStatusBadge(task.status)]">{{ task.status.replace('_', ' ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>