<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const { register } = useAuthStore();

// Retrait du champ skills du modèle
const form = reactive({ name: '', email: '', password: '' });
const error = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  error.value = '';
  isSubmitting.value = true;

  try {
    // Envoi direct du formulaire sans les skills
    const result = await register(form);

    if (!result.success) {
      error.value = result.error;
    }
  } catch (err) {
    error.value = err.message || "Erreur inconnue lors de l'inscription.";
  } finally {
    isSubmitting.value = false;
  }
};

// Émet un événement pour informer App.vue de changer d'écran
const emit = defineEmits(['switchView']);
</script>

<template>
  <div class="max-w-md w-full p-8 space-y-6 bg-white shadow-xl rounded-xl">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center">Créer un compte DevFirstStep</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        {{ error }}
      </div>

      <input type="text" name="name" placeholder="Nom complet" v-model="form.name" required
             class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />

      <input type="email" name="email" placeholder="Email" v-model="form.email" required
             class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />

      <input type="password" name="password" placeholder="Mot de passe" v-model="form.password" required
             class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />

      <!-- Le champ skills a été retiré ici -->

      <button type="submit" :disabled="isSubmitting"
              class="w-full px-4 py-3 text-white font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2
               focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-300">
        {{ isSubmitting ? "Inscription..." : "S'inscrire" }}
      </button>

      <p class="text-center text-sm text-gray-600 mt-4">
        Déjà un compte ?
        <span class="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800" @click="$emit('switchView', 'login')">Se connecter</span>
      </p>
    </form>
  </div>
</template>