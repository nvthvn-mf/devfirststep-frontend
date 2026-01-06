import { ref, computed } from 'vue';
import api from '@/services/api';

const currentUser = ref(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);

export const useAuthStore = () => {

    const login = async (credentials) => {
        try {
            const data = await api.post('auth/authenticate', credentials);
            localStorage.setItem('jwtToken', data.token);
            isAuthenticated.value = true;
            await loadProfile();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || "Erreur de connexion" };
        }
    };

    const register = async (userData) => {
        try {
            const data = await api.post('auth/register', userData);
            localStorage.setItem('jwtToken', data.token);
            isAuthenticated.value = true;
            await loadProfile();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || "Erreur d'inscription" };
        }
    };

    const loadProfile = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            isLoading.value = false;
            isAuthenticated.value = false;
            return;
        }

        try {
            const data = await api.get('users/me');
            currentUser.value = data;
            isAuthenticated.value = true;
        } catch (error) {
            console.error("Échec du chargement du profil", error);
            logout();
        } finally {
            isLoading.value = false;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        currentUser.value = null;
        isAuthenticated.value = false;
        // On ne fait plus window.location ici, on laisse le router gérer
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