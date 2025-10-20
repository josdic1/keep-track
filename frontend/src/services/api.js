import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5555/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track API
export const getTracks = () => api.get('/tracks');
export const getTrack = (id) => api.get(`/tracks/${id}`);
export const postTrack = (data) => api.post('/tracks', data);
export const updateTrack = (id, data) => api.put(`/tracks/${id}`, data);
export const deleteTrack = (id) => api.delete(`/tracks/${id}`);

// Artist API
export const getArtists = () => api.get('/artists');
export const getArtist = (id) => api.get(`/artists/${id}`);
export const postArtist = (data) => api.post('/artists', data);
export const updateArtist = (id, data) => api.put(`/artists/${id}`, data);
export const deleteArtist = (id) => api.delete(`/artists/${id}`);

// Link API
export const getLinks = () => api.get('/links');
export const getLink = (id) => api.get(`/links/${id}`);
export const postLink = (data) => api.post('/links', data);
export const updateLink = (id, data) => api.put(`/links/${id}`, data);
export const deleteLink = (id) => api.delete(`/links/${id}`);

// Tag API
export const getTags = () => api.get('/tags');
export const getTag = (id) => api.get(`/tags/${id}`);
export const postTag = (data) => api.post('/tags', data);
export const updateTag = (id, data) => api.put(`/tags/${id}`, data);
export const deleteTag = (id) => api.delete(`/tags/${id}`);

// Media API
export const getMedias = () => api.get('/medias');
export const getMedia = (id) => api.get(`/medias/${id}`);
export const postMedia = (data) => api.post('/medias', data);
export const updateMedia = (id, data) => api.put(`/medias/${id}`, data);
export const deleteMedia = (id) => api.delete(`/medias/${id}`);

export default api;
