import axios from 'axios';

// Create axios instance with base URL
// Uses the Vite proxy configured in vite.config.js
const api = axios.create({
    baseURL: '/api',
});

export const pestService = {
    predict: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/predict/pest', formData);
        return response.data;
    },
};

export const cropService = {
    predict: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/predict/crop', formData);
        return response.data;
    },
};

export const multispectralService = {
    getData: async () => {
        // Assuming GET for now based on backend
        const response = await api.get('/predict/multispectral');
        return response.data;
    }
};

export default api;
