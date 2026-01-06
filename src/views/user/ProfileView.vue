<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();
const { api } = authStore;

// État local pour le formulaire et l'interface
const loading = ref(true);
const isSubmitting = ref(false);
const error = ref(null);
const successMessage = ref(null);

const form = reactive({
  name: '',
  email: '' // L'email est souvent en lecture seule
});

// Charger les données de l'utilisateur au montage
const fetchProfile = async () => {
  loading.value = true;
  error.value = null;
  try {
    // On récupère les infos fraîches du backend
    const data = await api.get('users/me');
    form.name = data.name;
    form.email = data.email;
  } catch (err) {
    error.value = "Impossible de charger les informations du profil.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProfile);

// Mise à jour du profil
const handleUpdateProfile = async () => {
  isSubmitting.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    await api.put('users/profile', {
      name: form.name
    });

    successMessage.value = "Profil mis à jour avec succès !";

    // Optionnel : Mettre à jour l'utilisateur dans le store global si nécessaire
    if (authStore.currentUser) {
      authStore.currentUser.name = form.name;
    }

  } catch (err) {
    error.value = err.message || "Une erreur est survenue lors de la mise à jour.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Mon Profil</h1>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-4 text-gray-500">Chargement de vos informations...</p>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div class="bg-indigo-600 h-32 w-full"></div>

      <div class="px-8 pb-8">
        <!-- Avatar fictif -->
        <div class="relative -mt-16 mb-6">
          <div class="h-32 w-32 bg-white rounded-full p-2 shadow-lg">
            <div class="h-full w-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <svg class="h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Alertes -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {{ error }}
        </div>
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          {{ successMessage }}
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleUpdateProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email (non modifiable)</label>
              <input
                  type="email"
                  v-model="form.email"
                  disabled
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nom Complet</label>
              <input
                  type="text"
                  v-model="form.name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100 flex justify-end">
            <button
                type="submit"
                :disabled="isSubmitting"
                class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">Enregistrement...</span>
              <span v-else>Sauvegarder les modifications</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>