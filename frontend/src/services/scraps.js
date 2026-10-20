import api from './api';

export const scrapService = {
  listar: (usuarioId, params) => api.get(`/scraps/usuario/${usuarioId}`, { params }),
  contar: (usuarioId) => api.get(`/scraps/contar/${usuarioId}`),
  criar: (usuarioId, dados) => api.post(`/scraps/usuario/${usuarioId}`, dados),
  excluir: (id) => api.delete(`/scraps/${id}`),
};
