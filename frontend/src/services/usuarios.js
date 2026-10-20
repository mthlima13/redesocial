import api from './api';

export const usuarioService = {
  getPerfil: () => api.get('/usuarios/perfil'),
  getPerfilPublico: (id) => api.get(`/usuarios/${id}`),
  atualizarPerfil: (dados) => api.put('/usuarios/perfil', dados),
  excluirConta: () => api.delete('/usuarios/perfil'),
};

export const caoService = {
  cadastrar: (dados) => api.post('/caos', dados),
  listarMeus: () => api.get('/caos/meus'),
  listarPorUsuario: (usuarioId) => api.get(`/caos/usuario/${usuarioId}`),
  buscarPorId: (id) => api.get(`/caos/${id}`),
  atualizar: (id, dados) => api.put(`/caos/${id}`, dados),
  excluir: (id) => api.delete(`/caos/${id}`),
};
