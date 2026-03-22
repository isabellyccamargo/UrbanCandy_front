import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@UrbanCandy:token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/pedido/checkout', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao finalizar pedido" };
  }
};

// ... suas outras funções (getAllCategory, etc)

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categoria/salvar', categoryData);
    return response.data;
  } catch (error) {
    // Aqui capturamos o erro do back (ex: "Já existe uma categoria com este nome")
    throw error.response?.data || { mensagem: "Erro ao criar categoria" };
  }
};

// Se quiser já deixar o de excluir pronto também:
export const deleteCategory = async (id_category) => {
  try {
    await api.delete(`/categoria/excluir/${id_category}`);
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao excluir categoria" };
  }
};

export const updateCategory = async (id_category, categoryData) => {
  try {
    const response = await api.put(`/categoria/atualizar/${id_category}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    throw error.response?.data || { mensagem: "Erro ao atualizar categoria" };
  }
};

export default api;

