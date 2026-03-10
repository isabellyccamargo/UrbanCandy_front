import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030', 
});

// Função para buscar os produtos que aparecerão na imagem que você enviou
export const getFeaturedProducts = async () => {
  // Aqui usamos a sua rota EXATA: /produto/listar
  const response = await api.get('/produto/destaque'); 
  return response.data;
};