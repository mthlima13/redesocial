import api from './api';

export const postService = {
  listarFeed: (params) => api.get('/posts', { params }),
  criar: (dados) => api.post('/posts', dados),
  uploadImagem: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  buscarPorId: (id) => api.get(`/posts/${id}`),
  listarPorUsuario: (usuarioId, params) => api.get(`/posts/usuario/${usuarioId}`, { params }),
  excluir: (id) => api.delete(`/posts/${id}`),
};

export const interacaoService = {
  curtir: (postId) => api.post(`/interacoes/curtir/${postId}`),
  comentar: (postId, dados) => api.post(`/interacoes/comentar/${postId}`, dados),
  listarComentarios: (postId, params) => api.get(`/interacoes/comentarios/${postId}`, { params }),
  excluirComentario: (id) => api.delete(`/interacoes/comentarios/${id}`),
};

export const seguirService = {
  seguir: (usuarioId) => api.post(`/seguir/${usuarioId}`),
  deixarDeSeguir: (usuarioId) => api.delete(`/seguir/${usuarioId}`),
  isSeguindo: (usuarioId) => api.get(`/seguir/is-seguindo/${usuarioId}`),
  contarSeguidores: (usuarioId) => api.get(`/seguir/contar-seguidores/${usuarioId}`),
};
