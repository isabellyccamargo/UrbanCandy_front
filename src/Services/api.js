import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030',
});

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get('/produto/listar');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryName) => {
  try {
    const response = await api.get(`/category/${categoryName}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categoryName}:`, error);
    throw error;
  }
};