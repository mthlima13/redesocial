import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usuarioService, caoService } from '../services/usuarios';
import { seguirService } from '../services/posts';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Card from '../components/ui/Card.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Badge from '../components/ui/Badge.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function Perfil() {
  const { user, logout, atualizarPerfil } = useAuth();
  const { sucesso, erro } = useToast();
  const [perfil, setPerfil] = useState(null);
  const [caos, setCaos] = useState([]);
  const [seguidoresCount, setSeguidoresCount] = useState(0);
  const [edicao, setEdicao] = useState(false);
  const [form, setForm] = useState({});
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [uploadandoFoto, setUploadandoFoto] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const res = await usuarioService.getPerfil();
      setPerfil(res.data);
      setForm({ ...res.data });
      setFotoPreview(res.data.fotoUrl || null);
    } catch (e) {
      erro('Erro ao carregar perfil');
      console.error(e);
    }
    try {
      const res = await seguirService.contarSeguidores(user.id);
      setSeguidoresCount(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      erro('Selecione apenas arquivos de imagem');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      erro('A imagem deve ter no máximo 5MB');
      return;
    }
    setFotoPerfil(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const res = await usuarioService.atualizarPerfil(form);
      setPerfil(res.data);
      setEdicao(false);
      sucesso('Perfil atualizado com sucesso');
    } catch (e) {
      erro('Erro ao atualizar perfil');
    }
  };

  const handleUploadFoto = async () => {
    if (!fotoPerfil) return;
    setUploadandoFoto(true);
    try {
      const formData = new FormData();
      formData.append('file', fotoPerfil);
      const res = await fetch('/api/posts/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Erro no upload');
      const data = await res.json();
      setForm({ ...form, fotoUrl: data.url });
      setFotoPreview(data.url);
      sucesso('Foto de perfil atualizada');
    } catch (e) {
      erro('Erro ao enviar foto');
    } finally {
      setUploadandoFoto(false);
      setFotoPerfil(null);
    }
  };

  if (!perfil) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Carregando perfil..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{perfil.nome || 'Perfil'}</h1>
          {perfil.cidade && (
            <p className="text-neutral-500">{perfil.cidade}</p>
          )}
        </div>
        {!edicao ? (
          <Button variant="outline" onClick={() => setEdicao(true)}>
            Editar perfil
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setEdicao(false)}>
            Cancelar
          </Button>
        )}
      </div>

      {edicao ? (
        <form onSubmit={handleSalvar} className="space-y-6 max-w-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              {fotoPreview && (
                <img
                  src={fotoPreview}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-2 border-instadog-600"
                />
              )}
              {!fotoPreview && (
                <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center border-2 border-instadog-600">
                  <span className="text-instadog-600 text-lg">🐾</span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-instadog-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-instadog-700 transition focus:outline-none focus:ring-2 focus:ring-instadog-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                  aria-label="Alterar foto de perfil"
                />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </label>
              {uploadandoFoto && (
                <div className="absolute bottom-0 left-0 flex items-center justify-center w-24 h-24">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-instadog-600" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleUploadFoto}
              disabled={!fotoPerfil || uploadandoFoto}
              className="px-4 py-2 bg-instadog-600 text-white rounded-lg font-medium hover:bg-instadog-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-instadog-300"
            >
              {uploadandoFoto ? 'Enviando...' : 'Salvar foto'}
            </button>
          </div>

          <Input
            label="Nome"
            value={form.nome || ''}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            aria-label="Nome"
            required
          />
          <Input
            label="Cidade"
            value={form.cidade || ''}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            aria-label="Cidade"
          />
          <Input
            label="Bio"
            as="textarea"
            rows={3}
            value={form.bio || ''}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            aria-label="Biografia"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
          >
            Salvar alterações
          </Button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm" padding="p-6">
            <div className="flex items-center gap-4 mb-6">
              {perfil.fotoUrl && (
                <img
                  src={perfil.fotoUrl}
                  alt={`Foto de perfil de ${perfil.nome}`}
                  className="w-16 h-16 rounded-full object-cover bg-neutral-200 border border-neutral-200"
                />
              )}
              {!perfil.fotoUrl && (
                <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center border border-neutral-200">
                  <span className="text-xl">🐾</span>
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{perfil.nome || 'Usuário'}</h2>
                {perfil.cidade && <p className="text-sm text-neutral-500">{perfil.cidade}</p>}
              </div>
            </div>
            <h3 className="text-base font-semibold mb-2 text-neutral-900">Sobre</h3>
            <p className="text-neutral-600">{perfil.bio || 'Sem bio ainda.'}</p>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-sm text-neutral-500">
                Membro desde{' '}
                {perfil.criadoEm ? new Date(perfil.criadoEm).toLocaleDateString('pt-BR') : ''}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                {seguidoresCount} seguidor{seguidoresCount !== 1 ? 'es' : ''}
              </p>
            </div>
          </Card>

          <Card className="shadow-sm" padding="p-6">
            <h2 className="text-lg font-semibold mb-4 text-neutral-900">Seus cães</h2>
            {caos.length === 0 && (
              <p className="text-neutral-500 text-sm">Nenhum cão cadastrado.</p>
            )}
            {caos.map((cao) => (
              <div key={cao.id} className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                <p className="font-semibold text-neutral-900">{cao.nome}</p>
                <p className="text-sm text-neutral-600">
                  {cao.raca || ''} • {cao.porte || ''}
                </p>
              </div>
            ))}
          </Card>

          <div className="col-span-1 md:col-span-2">
            <button
              onClick={logout}
              className="w-full py-3 bg-error-500 text-white rounded-lg font-medium hover:bg-error-600 transition focus:outline-none focus:ring-2 focus:ring-error-300"
            >
              Excluir minha conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
