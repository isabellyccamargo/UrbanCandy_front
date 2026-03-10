import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030', 
});

export const getFeaturedProducts = async () => {
  const response = await api.get('/produto/listar'); 
  return response.data;
};