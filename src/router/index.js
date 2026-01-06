import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

// Importation des vues
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import ProjectListView from '@/views/projects/ProjectListView.vue';
import ProjectDetailView from '@/views/projects/ProjectDetailView.vue';
import ProfileView from '@/views/user/ProfileView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { guestOnly: true } // Accessible seulement si NON connecté
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: { guestOnly: true }
        },
        {
            path: '/',
            name: 'projects',
            component: ProjectListView,
            meta: { requiresAuth: true } // Protégé
        },
        {
            path: '/projects/:id', // URL dynamique avec ID
            name: 'project-detail',
            component: ProjectDetailView,
            props: true, // Passe l'ID comme "props" au composant
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfileView,
            meta: { requiresAuth: true }
        },
        // Redirection par défaut
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
});

// Gardien de navigation (Navigation Guard)
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Attendre que le profil soit chargé (au cas où on rafraîchit la page)
    if (authStore.isLoading) {
        await authStore.loadProfile();
    }

    const isAuthenticated = authStore.isAuthenticated;

    // 1. Si la route nécessite une auth et qu'on n'est pas connecté -> Login
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'login' });
    }

    // 2. Si la route est "invité seulement" (login/register) et qu'on est connecté -> Dashboard
    if (to.meta.guestOnly && isAuthenticated) {
        return next({ name: 'projects' });
    }

    next();
});

export default router;