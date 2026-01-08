import { ref } from 'vue';
import api from '@/services/api';
import router from "@/router/index.js";

// État partagé unique
const currentUser = ref(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);

export const useAuthStore = () => {

    const loadProfile = async () => {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            isAuthenticated.value = false;
            isLoading.value = false;
            return;
        }

        try {
            // FIX : 'users/me' au lieu de 'user/me'
            const data = await api.get('users/me');
            currentUser.value = data;
            isAuthenticated.value = true;
        } catch (error) {
            console.error("Session invalide ou expirée");
            logout();
        } finally {
            isLoading.value = false;
        }
    };

    const login = async (credentials) => {
        try {
            const data = await api.post('auth/login', credentials);
            localStorage.setItem('jwtToken', data.token);
            await loadProfile();
            return { success: true };
        } catch (error) {
            return { success: false, error: "Identifiants incorrects" };
        }
    };

    const register = async (userData) => {
        try {
            const data = await api.post('auth/register', userData);
            localStorage.setItem('jwtToken', data.token);
            await loadProfile();
            return { success: true };
        } catch (error) {
            return { success: false, error: "Erreur d'inscription" };
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        currentUser.value = null;
        isAuthenticated.value = false;
        isLoading.value = false;
        router.push({ name: 'login' });
    };

    return {
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        loadProfile,
        api
    };
};