import api from './api';

export const usuarioService = {
  getPerfil: () => api.get('/usuarios/perfil'),
  atualizarPerfil: (dados) => api.put('/usuarios/perfil', dados),
  excluirConta: () => api.delete('/usuarios/perfil'),
};

export const caoService = {
  cadastrar: (dados) => api.post('/caos', dados),
  buscarPorId: (id) => api.get(`/caos/${id}`),
  atualizar: (id, dados) => api.put(`/caos/${id}`, dados),
  excluir: (id) => api.delete(`/caos/${id}`),
};
