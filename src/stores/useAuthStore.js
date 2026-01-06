import { ref, computed } from 'vue';
import { api, TokenStorage } from '@/services/api';

// État centralisé
const currentUser = ref(null);
const isLoading = ref(true);

/**
 * Hook pour gérer l'état d'authentification et les actions associées.
 */
export function useAuthStore() {

    const isAuthenticated = computed(() => !!currentUser.value);

    // Charge le profil si un token est présent
    const loadProfile = async () => {
        const token = TokenStorage.get();
        if (token) {
            try {
                const userData = await api.get('user/profile');
                currentUser.value = userData;
            } catch (error) {
                console.error("Token expiré ou invalide, déconnexion.", error);
                handleLogout();
            }
        }
        isLoading.value = false;
    };

    /** Gère l'inscription et la connexion */
    const handleAuth = async (endpoint, credentials) => {
        isLoading.value = true;
        try {
            const response = await api.post(`auth/${endpoint}`, credentials);

            if (response && response.token) {
                TokenStorage.set(response.token);
                await loadProfile();
            }
            return { success: true };
        } catch (error) {
            isLoading.value = false;
            return { success: false, error: error.message };
        }
    };

    /** Gère la déconnexion */
    const handleLogout = () => {
        TokenStorage.clear();
        currentUser.value = null;
        window.location.reload();
    };

    return {
        // État
        currentUser,
        isAuthenticated,
        isLoading,

        // Actions
        loadProfile,
        logout: handleLogout,
        login: (creds) => handleAuth('login', creds),
        // Le register n'envoie plus le champ skills
        register: (creds) => handleAuth('register', creds),
        api,
    };
}