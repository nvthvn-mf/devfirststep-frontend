<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
import { inject } from 'vue';

const { currentUser } = useAuthStore();
// Note: Le store est injecté via le provide/inject dans App.vue

// Logique pour modifier le profil (à implémenter plus tard dans le Module F3.1)
const isEditing = ref(false);

</script>

<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Mon Profil</h1>
    <div class="mt-8 p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-600">
      <h2 class="text-2xl font-semibold mb-4 text-indigo-600">{{ currentUser.name }}</h2>
      <div class="space-y-4 text-gray-700">
        <p><strong>Email :</strong> {{ currentUser.email }}</p>

        <div>
          <strong>Bio :</strong>
          <p class="mt-1 p-3 bg-gray-50 border rounded-lg">{{ currentUser.bio || 'Non spécifiée.' }}</p>
        </div>

        <p><strong>Niveau :</strong>
          <span :class="['inline-block px-3 py-1 text-xs font-semibold rounded-full ml-2',
                                    currentUser.level === 'EXPERT' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                        {{ currentUser.level || 'BEGINNER' }}
                    </span>
        </p>

        <div>
          <strong>Compétences :</strong>
          <div class="mt-2 flex flex-wrap gap-2">
                        <span v-for="skill in currentUser.skills" :key="skill"
                              class="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full shadow-sm">
                            {{ skill }}
                        </span>
            <span v-if="!currentUser.skills || currentUser.skills.length === 0" class="text-gray-500 italic">
                            Aucune compétence renseignée.
                        </span>
          </div>
        </div>

        <!-- Bouton de modification à implémenter plus tard -->
        <button @click="isEditing = true"
                class="px-4 py-2 text-white font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition duration-150 mt-4">
          Modifier le Profil
        </button>
      </div>
    </div>
  </div>
</template>