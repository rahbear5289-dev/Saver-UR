import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getPreview = async (url) => {
  const response = await api.get('/preview', { params: { url } });
  return response.data;
};

export const getDownloadUrl = (url, name, type, formatId) => {
  const params = new URLSearchParams({
    url,
    ...(name && { name }),
    ...(type && { type }),
    ...(formatId && { formatId }),
  });
  return `${API_BASE_URL}/download?${params.toString()}`;
};
