import { useState, useEffect, useRef } from 'react';
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
  // "carregando" marca o carregamento de páginas adicionais; o primeiro
  // carregamento é controlado por "carregandoInicial".
  const [carregando, setCarregando] = useState(false);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [temMais, setTemMais] = useState(true);
  const [abordagem, setAbordagem] = useState('todos'); // 'todos' | 'seguidos'
  const [erro, setErro] = useState(null);
  // Impede requisições duplicadas (o StrictMode do React executa o efeito duas vezes)
  const carregandoRef = useRef(false);

  useEffect(() => {
    carregarFeed(0);
  }, [abordagem]);

  const carregarFeed = async (pagina) => {
    if (carregandoRef.current) return;
    carregandoRef.current = true;
    const primeiraPagina = pagina === 0;
    if (primeiraPagina) {
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
      // Forma funcional: evita usar um estado antigo quando a resposta chega
      setPosts((atual) => (primeiraPagina ? novos : [...atual, ...novos]));
      setTemMais(res.data.hasNext);
      setPage(pagina);
      setErro(null);
    } catch (e) {
      console.error(e);
      setErro(e.response?.data?.mensagem || 'Não foi possível carregar o feed');
    } finally {
      carregandoRef.current = false;
      setCarregando(false);
      setCarregandoInicial(false);
    }
  };

  // Recarrega o feed já carregado depois de curtir, comentar ou seguir.
  // Mantém a mesma quantidade de itens e não mostra skeleton no meio da ação.
  const recarregarFeed = async () => {
    try {
      const params = {
        page: 0,
        size: (page + 1) * 10,
      };
      if (abordagem === 'seguidos') {
        params.seguidos = 'true';
      }
      const res = await postService.listarFeed(params);
      setPosts(res.data.content);
      setTemMais(res.data.hasNext);
      setErro(null);
    } catch (e) {
      console.error(e);
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

      {!carregandoInicial && erro && (
        <div className="bg-error-50 border border-error-100 text-error-700 px-4 py-3 rounded-lg text-sm mb-6">
          <p className="font-medium mb-1">Não foi possível carregar o feed</p>
          <p className="mb-3">{erro}</p>
          <Button variant="outline" size="sm" onClick={() => carregarFeed(0)}>
            Tentar novamente
          </Button>
        </div>
      )}

      {!carregandoInicial && !erro && posts.length === 0 && (
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

      {!carregandoInicial && !erro && posts.length > 0 && (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLikeChange={recarregarFeed} />
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
