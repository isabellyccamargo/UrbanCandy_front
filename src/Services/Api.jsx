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
    const response = await api.get(`/produto/categoria/${categoryName}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categoryName}:`, error);
    throw error;
  }
};

export const getAllCategory = async () => {
  try {
    const response = await api.get(`/categoria/listar`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
}

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao conectar ao servidor" };
  }
};

export const getUserProfile = async (id_user) => {
  try {
    const response = await api.get(`/usuario/listarPorId/${id_user}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao carregar perfil" };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/usuario/salvar', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao realizar cadastro" };
  }
};

export const updateUser = async (id_user, userData, personData) => {
  try {
    const response = await api.put(`/usuario/atualizar/${id_user}`, {
      userData,
      personData
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error updating user" };
  }
};