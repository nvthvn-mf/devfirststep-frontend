import axios from 'axios';

/**
 * Service pour la gestion du token JWT dans le stockage local.
 */
export const TokenStorage = {
    get: () => localStorage.getItem('jwtToken'),
    set: (token) => localStorage.setItem('jwtToken', token),
    clear: () => localStorage.removeItem('jwtToken'),
};

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTEUR DE REQUÊTE : Ajoute le token automatiquement
api.interceptors.request.use((config) => {
    const token = TokenStorage.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// INTERCEPTEUR DE RÉPONSE : Gère les données et les erreurs globales
api.interceptors.response.use(
    (response) => {
        // Axios place les données de la réponse dans l'objet .data
        return response.data;
    },
    (error) => {
        // Si le serveur répond 401 (Non autorisé / Token expiré)
        if (error.response && error.response.status === 401) {
            console.warn("Session expirée ou non autorisée");
            TokenStorage.clear();
            // On ne fait PAS de redirection ici pour laisser le Router Vue gérer la navigation proprement
        }

        // On renvoie l'erreur pour que les composants puissent la traiter (ex: afficher un message)
        return Promise.reject(error);
    }
);

export default api;