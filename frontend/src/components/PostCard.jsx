import { Heart, MessageCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { interacaoService } from '../services/posts';

export default function PostCard({ post, onLikeChange }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.curtidoPorUsuarioLogado || false);
  const [likes, setLikes] = useState(post.curtidasCount || 0);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    try {
      await interacaoService.curtir(post.id);
      onLikeChange?.();
    } catch (e) {
      setIsLiked(isLiked);
      setLikes(likes);
    }
  };

  const tempo = new Date(post.criadoEm).toLocaleString('pt-BR');

  return (
    <article className="card mb-6 animate-fade-in">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <img
          src={post.usuarioFotoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.usuarioNome) + '&background=random'}
          alt={post.usuarioNome}
          className="avatar"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">{post.usuarioNome}</p>
          <p className="text-xs text-gray-500">
            com <span className="font-medium">{post.caoNome}</span> • {tempo}
          </p>
        </div>
      </div>

      {post.imagemUrl && (
        <img
          src={post.imagemUrl}
          alt="Post"
          className="w-full h-64 object-cover bg-gray-100"
        />
      )}

      <div className="p-4">
        {post.descricao && (
          <p className="text-gray-700 mb-3">{post.descricao}</p>
        )}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-instadog-600 transition"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-instadog-600 text-instadog-600' : 'fill-current'}`} />
            <span className={isLiked ? 'font-semibold text-instadog-600' : ''}>{likes}</span>
          </button>
          <button className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-instadog-600 transition">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comentariosCount || 0}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
