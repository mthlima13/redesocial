import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/posts';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [temMais, setTemMais] = useState(true);
  const [abordagem, setAbordagem] = useState('todos'); // 'todos' | 'seguidos'

  useEffect(() => {
    carregarFeed(0);
  }, [abordagem]);

  const carregarFeed = async (pagina) => {
    if (carregando) return;
    if (pagina === 0) {
      setCarregandoInicial(true);
    } else {
      setCarregando(true);
    }
    try {
      const params = {
        page: pagina,
        size: 10,
      };
      if (abordagem === 'seguidos') {
        params.seguidos = 'true';
      }
      const res = await postService.listarFeed(params);
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

  const renderSkeletons = () => {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  };

  const filtroBtn = (ativo, label, onClick) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        ativo
          ? 'bg-instadog-600 text-white'
          : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Feed 🐾</h1>
          <p className="text-sm text-neutral-500">
            Bem-vindo, {user?.nome}
          </p>
        </div>
        <Link to="/criar-post" className="btn-primary btn-sm">
          Nova publicação
        </Link>
      </div>

      {/* Filtro Todos / Seguidos */}
      <div className="flex gap-2 mb-8">
        {filtroBtn(
          abordagem === 'todos',
          'Todos',
          () => { setAbordagem('todos'); setPage(0); }
        )}
        {filtroBtn(
          abordagem === 'seguidos',
          'Seguidos',
          () => { setAbordagem('seguidos'); setPage(0); }
        )}
      </div>

      {carregandoInicial && renderSkeletons()}

      {!carregandoInicial && posts.length === 0 && (
        <EmptyState
          icon="📭"
          title={
            abordagem === 'seguidos'
              ? 'Nenhum post de quem você segue'
              : 'Nenhum post ainda'
          }
          description={
            abordagem === 'seguidos'
              ? 'Comece a seguir outros tutores para ver seus posts aqui.'
              : 'Seja o primeiro a compartilhar uma foto do seu cão!'
          }
          actionText="Criar primeiro post"
          actionHref="/criar-post"
        />
      )}

      {!carregandoInicial && posts.length > 0 && (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLikeChange={carregarFeed} />
          ))}

          {carregando && (
            <div className="text-center py-4">
              <LoadingSpinner size="md" text="Carregando mais..." />
            </div>
          )}

          {temMais && (
            <Button
              onClick={carregarMais}
              variant="outline"
              className="w-full"
              disabled={carregando}
            >
              Carregar mais
            </Button>
          )}
        </>
      )}
    </div>
  );
}
