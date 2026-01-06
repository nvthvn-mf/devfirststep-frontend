<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

// Récupération des actions depuis le store global
const { login } = useAuthStore();
const router = useRouter();

// État local du formulaire
const form = reactive({ email: '', password: '' });
const error = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  error.value = '';
  isSubmitting.value = true;

  try {
    const result = await login(form);
    if (result.success) {
      // Redirection vers la liste des projets après connexion réussie
      router.push({ name: 'projects' });
    } else {
      error.value = result.error || 'Erreur de connexion. Vérifiez vos identifiants.';
    }
  } catch (err) {
    error.value = err.message || "Erreur inconnue lors de la connexion.";
  } finally {
    isSubmitting.value = false;
  }
};

const goToRegister = () => {
  router.push({ name: 'register' });
};
</script>

<template>
  <div class="max-w-md w-full p-8 space-y-6 bg-white shadow-xl rounded-xl">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center">Connexion à DevFirstStep</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        {{ error }}
      </div>

      <input type="email" name="email" placeholder="Email" v-model="form.email" required
             class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />

      <input type="password" name="password" placeholder="Mot de passe" v-model="form.password" required
             class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />

      <button type="submit" :disabled="isSubmitting"
              class="w-full px-4 py-3 text-white font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-300">
        {{ isSubmitting ? 'Connexion...' : 'Se connecter' }}
      </button>

      <p class="text-center text-sm text-gray-600 mt-4">
        Pas encore de compte ?
        <span class="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800" @click="goToRegister">S'inscrire</span>
      </p>
    </form>
  </div>
</template>