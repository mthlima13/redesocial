import { Heart, MessageCircle, Clock, UserPlus, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { interacaoService, seguirService } from '../services/posts';
import ComentarioCard from './ComentarioCard';

export default function PostCard({ post, onLikeChange }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.curtidoPorUsuarioLogado || false);
  const [likes, setLikes] = useState(post.curtidasCount || 0);
  const [comentariosAbertos, setComentariosAbertos] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [textoComentario, setTextoComentario] = useState('');
  const [carregandoComentarios, setCarregandoComentarios] = useState(false);
  const [seguindo, setSeguindo] = useState(null); // null = não carregado
  const [comentarioErro, setComentarioErro] = useState('');

  useEffect(() => {
    setIsLiked(post.curtidoPorUsuarioLogado || false);
    setLikes(post.curtidasCount || 0);
  }, [post]);

  useEffect(() => {
    if (user && post.usuarioId !== user.id) {
      carregarSeguindo();
    }
  }, [user, post]);

  const carregarSeguindo = async () => {
    try {
      const res = await seguirService.isSeguindo(post.usuarioId);
      setSeguindo(res.data);
    } catch (e) {
      setSeguindo(false);
    }
  };

  const handleLike = async () => {
    const nextIsLiked = !isLiked;
    const nextLikes = nextIsLiked ? likes + 1 : likes - 1;
    setIsLiked(nextIsLiked);
    setLikes(nextLikes);
    try {
      await interacaoService.curtir(post.id);
      onLikeChange?.();
    } catch (e) {
      setIsLiked(isLiked);
      setLikes(likes);
    }
  };

  const toggleComentarios = async () => {
    setComentariosAbertos(!comentariosAbertos);
    if (!comentariosAbertos && comentarios.length === 0) {
      carregarComentarios();
    }
  };

  const carregarComentarios = async () => {
    setCarregandoComentarios(true);
    try {
      const res = await interacaoService.listarComentarios(post.id, { page: 0, size: 20 });
      setComentarios(res.data.content);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregandoComentarios(false);
    }
  };

  const handleSeguir = async () => {
    if (seguindo === true) return;
    try {
      await seguirService.seguir(post.usuarioId);
      setSeguindo(true);
    } catch (e) {
      alert('Não foi possível seguir este usuário');
    }
  };

  const handleAdicionarComentario = async (e) => {
    e.preventDefault();
    if (!textoComentario.trim()) return;
    setComentarioErro('');
    try {
      const res = await interacaoService.comentar(post.id, { texto: textoComentario });
      setComentarios([res.data, ...comentarios]);
      setTextoComentario('');
      onLikeChange?.();
    } catch (err) {
      setComentarioErro(err.response?.data?.mensagem || 'Erro ao comentar');
    }
  };

  const handleExcluirComentario = async (id) => {
    try {
      await interacaoService.excluirComentario(id);
      setComentarios(comentarios.filter((c) => c.id !== id));
    } catch (e) {
      alert('Não foi possível excluir o comentário');
    }
  };

  const tempo = new Date(post.criadoEm).toLocaleString('pt-BR');

  return (
    <article className="card mb-6 animate-fade-in overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <img
          src={post.usuarioFotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.usuarioNome)}&background=random`}
          alt={post.usuarioNome}
          className="avatar"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm flex items-center gap-1">
            {post.usuarioNome}
            {seguindo === true && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded ml-1">Seguindo</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            com <span className="font-medium">{post.caoNome}</span> • {tempo}
          </p>
        </div>
        {user && post.usuarioId !== user.id && seguindo === false && (
          <button
            onClick={handleSeguir}
            className="text-xs bg-instadog-600 text-white px-2 py-1 rounded hover:bg-instadog-700 transition"
          >
            Seguir
          </button>
        )}
        {user && post.usuarioId !== user.id && seguindo === null && (
          <div className="w-6 h-6 bg-gray-100 rounded-full animate-pulse" />
        )}
      </div>

      {post.imagemUrl && (
        <img
          src={post.imagemUrl}
          alt="Post"
          className="w-full h-64 object-cover bg-gray-100 cursor-pointer"
        />
      )}

      <div className="p-4">
        {post.descricao && (
          <p className="text-gray-700 mb-4">{post.descricao}</p>
        )}
        <div className="flex items-center gap-4 text-sm mb-3">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-instadog-600 transition"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-instadog-600 text-instadog-600' : ''}`} />
            <span className={isLiked ? 'font-semibold text-instadog-600' : ''}>{likes}</span>
          </button>
          <button
            onClick={toggleComentarios}
            className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-instadog-600 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comentariosCount || 0}</span>
          </button>
        </div>

        {comentariosAbertos && (
          <div className="border-t border-gray-100 pt-4">
            {carregandoComentarios && comentarios.length === 0 && (
              <div className="text-center py-3 text-xs text-gray-500">Carregando comentários...</div>
            )}
            {comentarios.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {comentarios.map((c) => (
                  <ComentarioCard
                    key={c.id}
                    comentario={c}
                    onExcluir={() => handleExcluirComentario(c.id)}
                    podeExcluir={user && c.usuarioId === user.id}
                  />
                ))}
              </div>
            )}
            {comentarios.length === 0 && !carregandoComentarios && (
              <p className="text-xs text-gray-400 text-center py-3">Sem comentários ainda</p>
            )}
            <form onSubmit={handleAdicionarComentario} className="mt-3 flex gap-2">
              <input
                className="flex-1 input-field"
                value={textoComentario}
                onChange={(e) => setTextoComentario(e.target.value)}
                placeholder="Escreva um comentário..."
              />
              <button
                type="submit"
                disabled={!textoComentario.trim()}
                className="px-3 py-1.5 bg-instadog-600 text-white rounded text-xs font-medium hover:bg-instadog-700 disabled:opacity-50"
              >
                Enviar
              </button>
              {comentarioErro && (
                <span className="text-xs text-red-600 self-end">{comentarioErro}</span>
              )}
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
