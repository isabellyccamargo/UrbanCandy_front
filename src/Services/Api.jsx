import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030',
});

const token = localStorage.getItem('@UrbanCandy:token');
if (token) {
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

let openLoginModalCallback = null;

export const setOpenLoginModalCallback = (callback) => {
  openLoginModalCallback = callback;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('@UrbanCandy:token');
      localStorage.removeItem('@UrbanCandy:user');


      if (openLoginModalCallback) {
        openLoginModalCallback();
      }
    }
    return Promise.reject(error);
  }
);
export const setHeaderToken = (token) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export const getFeaturedProducts = (page = 1, size = 6) => {
  return api.get(`/produto/listar`, {
    params: { page, size }
  });
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

export const updateUser = async (id_people, peopleData) => {
  try {
    const response = await api.put(`/pessoa/atualizar/${id_people}`, peopleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao atualizar usuário" };
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


export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categoria/salvar', categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao criar categoria" };
  }
};

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

export const getAllOrders = async () => {
  try {
    const response = await api.get('/pedido/listar');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error;
  }
};

export const deleteProduct = async (id_product) => {
  try {
    await api.delete(`/produto/excluir/${id_product}`);
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao excluir produto" };
  }
};

export const createProduct = async (productFormData) => {
  try {
    const response = await api.post('/produto/salvar', productFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao criar produto" };
  }
};

export const updateProduct = async (id_product, productFormData) => {
  try {
    const response = await api.put(`/produto/atualizar/${id_product}`, productFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao atualizar produto" };
  }
};

export const updateAddress = async (id_address, addressData) => {
  try {
    const response = await api.put(`/endereco/atualizar/${id_address}`, addressData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao atualizar endereço" };
  }
};

export const getMyOrders = async (page = 1, size = 5) => {
  try {
    const response = await api.get(`/pedido/listar?page=${page}&size=${size}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao buscar pedidos" };
  }
};

export const getAllTypeOfPayment = async () => {
  try {
    const response = await api.get('/pagamento/listar', {
      params: { page: 1, size: 100 }
    });
    return response.data;;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao buscar tipos de pagamento" };
  }
};

export const createTypeOfPayment = async (paymentData) => {
  try {
    const response = await api.post('/pagamento/salvar', paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao criar tipo de pagamento" };
  }
};

export const updateTypeOfPayment = async (id_type_of_payment, paymentData) => {
  try {
    const response = await api.put(`/pagamento/atualizar/${id_type_of_payment}`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar tipo de pagamento:", error);
    throw error.response?.data || { mensagem: "Erro ao atualizar tipo de pagamento" };
  }
};

export const deleteTypeOfPayment = async (id_type_of_payment) => {
  try {
    await api.delete(`/pagamento/excluir/${id_type_of_payment}`);
  } catch (error) {
    throw error.response?.data || { mensagem: "Erro ao excluir tipo de pagamento" };
  }
};

export default api;

