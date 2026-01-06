<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';

const { register } = useAuthStore();
const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const error = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  error.value = '';
  isSubmitting.value = true;

  try {
    const result = await register(form);
    if (result.success) {
      // Redirection automatique vers la liste des projets après inscription
      router.push({ name: 'projects' });
    } else {
      error.value = result.error || "Une erreur est survenue lors de l'inscription.";
    }
  } catch (err) {
    error.value = "Impossible de contacter le serveur.";
  } finally {
    isSubmitting.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="max-w-md w-full p-8 space-y-6 bg-white shadow-xl rounded-xl">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center">Créer un compte</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
        {{ error }}
      </div>

      <div>
        <input type="text" placeholder="Nom complet" v-model="form.name" required
               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <div>
        <input type="email" placeholder="Email" v-model="form.email" required
               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <div>
        <input type="password" placeholder="Mot de passe" v-model="form.password" required
               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <button type="submit" :disabled="isSubmitting"
              class="w-full px-4 py-3 text-white font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-150">
        {{ isSubmitting ? 'Inscription...' : "S'inscrire" }}
      </button>

      <p class="text-center text-sm text-gray-600 mt-4">
        Déjà un compte ?
        <span class="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800" @click="goToLogin">Se connecter</span>
      </p>
    </form>
  </div>
</template>