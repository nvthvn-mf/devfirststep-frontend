import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

// Imports des vues... (garder tes imports actuels)
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import ProjectListView from '@/views/projects/ProjectListView.vue';
import ProjectDetailView from '@/views/projects/ProjectDetailView.vue';
import ProfileView from '@/views/user/ProfileView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
        { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
        { path: '/', name: 'projects', component: ProjectListView, meta: { requiresAuth: true } },
        { path: '/projects/:id', name: 'project-detail', component: ProjectDetailView, props: true, meta: { requiresAuth: true } },
        { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // CORRECTION : Utilisation de .value
    if (authStore.isLoading.value) {
        await authStore.loadProfile();
    }

    const isAuth = authStore.isAuthenticated.value;

    if (to.meta.requiresAuth && !isAuth) {
        return next({ name: 'login' });
    }

    if (to.meta.guestOnly && isAuth) {
        return next({ name: 'projects' });
    }

    next();
});

export default router;