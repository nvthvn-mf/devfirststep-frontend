const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * Service pour la gestion du token JWT dans le stockage local.
 */
export const TokenStorage = {
    get: () => localStorage.getItem('jwtToken'),
    set: (token) => localStorage.setItem('jwtToken', token),
    clear: () => localStorage.removeItem('jwtToken'),
};

/**
 * Classe utilitaire pour les appels HTTP vers l'API Spring Boot.
 */
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // Effectue une requête fetch avec gestion du token et des erreurs
    async request(endpoint, options = {}) {
        const token = TokenStorage.get();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const url = `${this.baseUrl}/${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Si le statut est 204 No Content (ex: DELETE), ne pas essayer de lire le JSON
            if (response.status === 204) {
                return null;
            }

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (!response.ok) {
                // Lance une erreur avec le message du backend
                const errorMessage = data.message || data.error || `Erreur ${response.status}: Requête échouée`;
                throw new Error(errorMessage);
            }

            return data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    // Fonctions de raccourci (GET, POST, PUT, DELETE)
    get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

// Exporte une instance du client API
export const api = new ApiClient(API_BASE_URL);