import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/posts';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [temMais, setTemMais] = useState(true);

  useEffect(() => {
    carregarFeed(0);
  }, []);

  const carregarFeed = async (pagina) => {
    if (carregando) return;
    if (pagina === 0) {
      setCarregandoInicial(true);
    } else {
      setCarregando(true);
    }
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
      setCarregandoInicial(false);
    }
  };

  const carregarMais = () => {
    if (!temMais || carregando || carregandoInicial) return;
    carregarFeed(page + 1);
    setPage(page + 1);
  };

  // Renderiza skeletons enquanto carrega inicialmente
  const renderSkeletons = () => {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feed 🐾</h1>
          <p className="text-sm text-gray-500">
            Bem-vindo, {user?.nome}
          </p>
        </div>
        <Link to="/criar-post" className="btn-primary">
          Nova publicação
        </Link>
      </div>

      {carregandoInicial && renderSkeletons()}

      {!carregandoInicial && posts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🐾</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum post ainda</h3>
          <p className="text-gray-500 text-sm mb-6">
            Seja o primeiro a compartilhar uma foto do seu cão!
          </p>
          <Link to="/criar-post" className="btn-primary">
            Criar primeiro post
          </Link>
        </div>
      )}

      {!carregandoInicial && posts.length > 0 && (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {carregando && (
            <div className="text-center py-4">
              <PostSkeleton />
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
        </>
      )}
    </div>
  );
}
