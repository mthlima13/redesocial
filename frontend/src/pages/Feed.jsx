import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/posts';
import PostCard from '../components/PostCard';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [temMais, setTemMais] = useState(true);

  useEffect(() => {
    carregarFeed(0);
  }, []);

  const carregarFeed = async (pagina) => {
    if (carregando) return;
    setCarregando(true);
    try {
      const res = await postService.listarFeed({ page: pagina, size: 10 });
      const novos = res.data.content;
      if (pagina === 0) {
        setPosts(novos);
      } else {
        setPosts([...posts, ...novos]);
      }
      setTemMais(res.data.hasNext);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  const carregarMais = () => {
    if (!temMais || carregando) return;
    carregarFeed(page + 1);
    setPage(page + 1);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feed 🐾</h1>
        <span className="text-sm text-gray-500">
          Bem-vindo, {user?.nome}
        </span>
      </div>

      {posts.length === 0 && !carregando && (
        <div className="text-center py-20">
          <p className="text-gray-500">Nenhum post ainda. Seja o primeiro! ✨</p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {carregando && (
        <div className="text-center py-4">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {temMais && (
        <button
          onClick={carregarMais}
          className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          Carregar mais
        </button>
      )}
    </div>
  );
}
