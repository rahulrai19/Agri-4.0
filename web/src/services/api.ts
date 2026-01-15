import axios from 'axios';

// Create axios instance with base URL
// If using proxy, we can use /api. If direct, use http://localhost:8000
const api = axios.create({
    baseURL: '/api', // Uses the Vite proxy
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const pestService = {
    predict: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/predict/pest', formData);
        return response.data;
    },
};

export const cropService = {
    predict: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/predict/crop', formData);
        return response.data;
    },
};

export default api;
