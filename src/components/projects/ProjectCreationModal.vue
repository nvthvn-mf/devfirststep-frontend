<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const emit = defineEmits(['close', 'projectCreated']);
const { api } = useAuthStore();

const form = reactive({
  name: '',
  description: '',
  objectives: '',
  stacks: '', // String séparé par des virgules
});

const error = ref(null);
const isSubmitting = ref(false);

const handleSubmit = async () => {
  error.value = null;
  isSubmitting.value = true;

  // Conversion de la chaîne de stacks en liste pour l'API Spring
  const stacksArray = form.stacks.split(',').map(s => s.trim()).filter(s => s.length > 0);

  try {
    await api.post('projects', {
      ...form,
      stacks: stacksArray,
    });

    // En cas de succès, fermer le modal et notifier le composant parent
    emit('projectCreated');
    emit('close');

  } catch (err) {
    error.value = err.message || "Erreur inconnue lors de la création du projet.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <!-- Modal Conteneur -->
  <div class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto z-50 flex items-center justify-center">

    <!-- Contenu du Modal -->
    <div class="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 scale-100">

      <!-- En-tête -->
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h3 class="text-2xl font-bold text-gray-900">Créer un Nouveau Projet</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{{ error }}</div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nom du Projet *</label>
          <input type="text" id="name" v-model="form.name" required
                 class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" v-model="form.description" rows="3"
                    class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        <div>
          <label for="objectives" class="block text-sm font-medium text-gray-700">Objectifs / Cahier des charges</label>
          <textarea id="objectives" v-model="form.objectives" rows="3"
                    class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        <div>
          <label for="stacks" class="block text-sm font-medium text-gray-700">Stacks utilisées (séparées par des virgules) *</label>
          <input type="text" id="stacks" v-model="form.stacks" required
                 placeholder="Ex: Spring Boot, Vue.js, PostgreSQL"
                 class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <!-- Pied de page du Modal -->
        <div class="flex justify-end pt-4 border-t">
          <button type="button" @click="$emit('close')"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-2">
            Annuler
          </button>
          <button type="submit" :disabled="isSubmitting"
                  class="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
            {{ isSubmitting ? 'Création...' : 'Créer le Projet' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>