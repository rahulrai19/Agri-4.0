import api from './api';

export const communityService = {
    // Posts
    getPosts: async (category = 'all', limit = 20, skip = 0) => {
        const params = new URLSearchParams();
        if (category !== 'all') params.append('category', category);
        params.append('limit', limit);
        params.append('skip', skip);

        const response = await api.get(`/community/posts?${params}`);
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post('/community/posts', postData);
        return response.data;
    },

    deletePost: async (postId, userId) => {
        const response = await api.delete(`/community/posts/${postId}`, {
            data: { user_id: userId }
        });
        return response.data;
    },

    // Likes
    toggleLike: async (postId, userId) => {
        const response = await api.post(`/community/posts/${postId}/like`, {
            user_id: userId
        });
        return response.data;
    },

    // Comments
    getComments: async (postId) => {
        const response = await api.get(`/community/posts/${postId}/comments`);
        return response.data;
    },

    createComment: async (postId, commentData) => {
        const response = await api.post(`/community/posts/${postId}/comments`, commentData);
        return response.data;
    },

    deleteComment: async (commentId, userId) => {
        const response = await api.delete(`/community/comments/${commentId}`, {
            data: { user_id: userId }
        });
        return response.data;
    }
};
