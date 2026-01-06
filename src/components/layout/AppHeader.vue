<script setup>
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const { currentUser, logout } = useAuthStore();
const router = useRouter();
const route = useRoute();

// Vérifie si la route est active pour le style
const isActive = (routeName) => route.name === routeName;

const goTo = (name) => router.push({ name });
</script>

<template>
  <header class="bg-indigo-600 text-white shadow-md sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      <div class="text-2xl font-bold cursor-pointer" @click="goTo('projects')">
        DevFirstStep
      </div>

      <nav v-if="currentUser" class="flex space-x-6 items-center">
        <a href="#" @click.prevent="goTo('projects')"
           :class="['px-3 py-2 text-sm font-medium rounded-md transition', isActive('projects') ? 'bg-indigo-700' : 'hover:bg-indigo-500']">
          Projets
        </a>

        <a href="#" @click.prevent="goTo('profile')"
           :class="['px-3 py-2 text-sm font-medium rounded-md transition', isActive('profile') ? 'bg-indigo-700' : 'hover:bg-indigo-500']">
          Profil
        </a>

        <div class="flex items-center space-x-2 bg-indigo-700 px-3 py-1 rounded-full">
          <span class="text-sm font-medium">{{ currentUser.email }}</span>
          <button @click="logout" class="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded-full transition">
            Déconnexion
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>