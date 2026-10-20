import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usuarioService, caoService } from '../services/usuarios';
import { uploadService } from '../services/upload';
import { scrapService } from '../services/scraps';
import { seguirService } from '../services/posts';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Card from '../components/ui/Card.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Badge from '../components/ui/Badge.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

/**
 * Perfil no estilo Orkut: cabeçalho com banner, menu de statistics à esquerda
 * e o mural de recados (scraps) à direita.
 */
export default function Perfil() {
  const { usuarioId } = useParams();
  const { user, logout, atualizarPerfil } = useAuth();
  const { sucesso, erro } = useToast();

  const alvoId = usuarioId ? Number(usuarioId) : user?.id;
  const ehMeuPerfil = !usuarioId || alvoId === user?.id;

  const [perfil, setPerfil] = useState(null);
  const [caos, setCaos] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [seguindo, setSeguindo] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [totalScraps, setTotalScraps] = useState(0);
  const [textoScrap, setTextoScrap] = useState('');
  const [enviandoScrap, setEnviandoScrap] = useState(false);
  const [seguindoUsuario, setSeguindoUsuario] = useState(null);
  const [edicao, setEdicao] = useState(false);
  const [form, setForm] = useState({});
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [uploadandoFoto, setUploadandoFoto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, [alvoId]);

  const carregarPerfil = async () => {
    if (!alvoId) return;
    try {
      const res = ehMeuPerfil
        ? await usuarioService.getPerfil()
        : await usuarioService.getPerfilPublico(alvoId);
      setPerfil(res.data);
      setForm({ ...res.data });
      setFotoPreview(res.data.fotoUrl || null);
    } catch (e) {
      erro('Erro ao carregar perfil');
      console.error(e);
    }

    try {
      const res = await caoService.listarPorUsuario(alvoId);
      setCaos(res.data || []);
    } catch (e) {
      console.error(e);
    }

    try {
      const [seg, sig] = await Promise.all([
        seguirService.listarSeguidores(alvoId),
        seguirService.listarSeguindo(alvoId),
      ]);
      setAmigos(seg.data || []);
      setSeguindo(sig.data || []);
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await scrapService.listar(alvoId, { page: 0, size: 20 });
      setScraps(res.data.content || []);
      setTotalScraps(res.data.totalElements || 0);
    } catch (e) {
      console.error(e);
    }

    if (!ehMeuPerfil) {
      try {
        const res = await seguirService.isSeguindo(alvoId);
        setSeguindoUsuario(res.data);
      } catch (e) {
        setSeguindoUsuario(false);
      }
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
      const atualizado = await atualizarPerfil(form);
      setPerfil(atualizado);
      setForm({ ...atualizado });
      setEdicao(false);
      sucesso('Perfil atualizado com sucesso');
    } catch (e) {
      erro(e.response?.data?.mensagem || 'Erro ao atualizar perfil');
    }
  };

  const handleUploadFoto = async () => {
    if (!fotoPerfil) return;
    setUploadandoFoto(true);
    try {
      const res = await uploadService.enviar(fotoPerfil);
      const atualizado = await atualizarPerfil({ ...form, fotoUrl: res.data.url });
      setForm({ ...atualizado });
      setPerfil(atualizado);
      setFotoPreview(atualizado.fotoUrl || res.data.url);
      sucesso('Foto de perfil atualizada');
    } catch (e) {
      erro(e.response?.data?.mensagem || 'Erro ao enviar foto');
    } finally {
      setUploadandoFoto(false);
      setFotoPerfil(null);
    }
  };

  const handleExcluirConta = async () => {
    const confirmacao = window.confirm(
      'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.'
    );
    if (!confirmacao) return;

    setExcluindo(true);
    try {
      await usuarioService.excluirConta();
      sucesso('Sua conta foi excluída');
      logout();
    } catch (e) {
      erro(e.response?.data?.mensagem || 'Erro ao excluir a conta');
      setExcluindo(false);
    }
  };

  const handleEnviarScrap = async (e) => {
    e.preventDefault();
    if (!textoScrap.trim()) return;
    setEnviandoScrap(true);
    try {
      const res = await scrapService.criar(alvoId, { texto: textoScrap });
      setScraps([res.data, ...scraps]);
      setTotalScraps(totalScraps + 1);
      setTextoScrap('');
      sucesso('Recado deixado!');
    } catch (err) {
      erro(err.response?.data?.mensagem || 'Erro ao deixar o recado');
    } finally {
      setEnviandoScrap(false);
    }
  };

  const handleExcluirScrap = async (id) => {
    try {
      await scrapService.excluir(id);
      setScraps(scraps.filter((s) => s.id !== id));
      setTotalScraps(totalScraps - 1);
    } catch (e) {
      erro('Não foi possível apagar o recado');
    }
  };

  const handleSeguir = async () => {
    try {
      await seguirService.seguir(alvoId);
      setSeguindoUsuario(true);
      sucesso(`Agora você segue ${perfil.nome}`);
      const res = await seguirService.listarSeguidores(alvoId);
      setAmigos(res.data || []);
    } catch (e) {
      erro('Não foi possível seguir este usuário');
    }
  };

  const handleDeixarDeSeguir = async () => {
    try {
      await seguirService.deixarDeSeguir(alvoId);
      setSeguindoUsuario(false);
      sucesso(`Você deixou de seguir ${perfil.nome}`);
      const res = await seguirService.listarSeguidores(alvoId);
      setAmigos(res.data || []);
    } catch (e) {
      erro('Não foi possível deixar de seguir este usuário');
    }
  };

  if (!perfil) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Carregando perfil..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* ================= Cabeçalho com banner ================= */}
      <div className="rounded-xl overflow-hidden border border-neutral-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-instadog-700 via-instadog-600 to-instadog-500" />
        <div className="px-6 pb-6 -mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
            <div className="relative">
              {perfil.fotoUrl ? (
                <img
                  src={perfil.fotoUrl}
                  alt={`Foto de perfil de ${perfil.nome}`}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-neutral-200 flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-3xl">🐾</span>
                </div>
              )}
            </div>

            <div className="flex-1 mt-3 sm:mt-0 sm:pb-1">
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
                {perfil.nome || 'Usuário'}
                {ehMeuPerfil && <Badge variant="success">você</Badge>}
              </h1>
              <p className="text-neutral-500">
                {perfil.cidade || 'Cidade não informada'} · Membro desde{' '}
                {perfil.criadoEm ? new Date(perfil.criadoEm).toLocaleDateString('pt-BR') : '—'}
              </p>
            </div>

            <div className="mt-3 sm:mt-0 sm:pb-1">
              {ehMeuPerfil ? (
                !edicao ? (
                  <Button variant="outline" onClick={() => setEdicao(true)}>
                    Editar perfil
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setEdicao(false)}>
                    Cancelar
                  </Button>
                )
              ) : (
                seguindoUsuario ? (
                  <Button variant="outline" onClick={handleDeixarDeSeguir}>
                    Seguindo
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleSeguir}>
                    Seguir
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= Formulário de edição ================= */}
      {edicao && (
        <Card className="shadow-sm mt-6" padding="p-6">
          <form onSubmit={handleSalvar} className="space-y-6 max-w-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                {fotoPreview && (
                  <img
                    src={fotoPreview}
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full object-cover border-2 border-instadog-600"
                  />
                )}
                {!fotoPreview && (
                  <div className="w-32 h-32 rounded-full bg-neutral-200 flex items-center justify-center border-2 border-instadog-600">
                    <span className="text-instadog-600 text-lg">🐾</span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-instadog-600 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-instadog-700 transition focus:outline-none focus:ring-2 focus:ring-instadog-300">
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
                  <div className="absolute bottom-0 left-0 flex items-center justify-center w-32 h-32">
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
            <Button type="submit" variant="primary" className="w-full">
              Salvar alterações
            </Button>
          </form>
        </Card>
      )}

      {/* ================= Corpo: menu + mural ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mt-6">
        {/* ---------- Coluna esquerda ---------- */}
        <div className="space-y-4">
          {/* Estatísticas */}
          <Card className="shadow-sm overflow-hidden" padding="p-0">
            <div className="bg-instadog-100 border-b border-instadog-200 px-4 py-2">
              <h2 className="text-sm font-bold text-instadog-800">Estatísticas</h2>
            </div>
            <div className="grid grid-cols-3 divide-x divide-neutral-100">
              <Stat valor={totalScraps} rotulo="Recados" />
              <Stat valor={amigos.length} rotulo="Amigos" />
              <Stat valor={caos.length} rotulo="Cães" />
            </div>
          </Card>

          {/* Sobre */}
          <Card className="shadow-sm overflow-hidden" padding="p-0">
            <div className="bg-instadog-100 border-b border-instadog-200 px-4 py-2">
              <h2 className="text-sm font-bold text-instadog-800">Sobre</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-neutral-600 leading-relaxed">
                {perfil.bio || 'Sem bio ainda.'}
              </p>
            </div>
          </Card>

          {/* Amigos */}
          <Card className="shadow-sm overflow-hidden" padding="p-0">
            <div className="bg-instadog-100 border-b border-instadog-200 px-4 py-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-instadog-800">Amigos</h2>
              <span className="text-xs text-neutral-500">{amigos.length}</span>
            </div>
            <div className="p-4">
              {amigos.length === 0 && (
                <p className="text-sm text-neutral-500">Nenhum amigo ainda.</p>
              )}
              <ul className="space-y-2">
                {amigos.map((amigo) => (
                  <li key={amigo.id}>
                    <Link
                      to={`/perfil/${amigo.id}`}
                      className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-neutral-50 transition"
                    >
                      <Avatar src={amigo.fotoUrl} alt={amigo.nome} size="sm" />
                      <span className="text-sm text-neutral-700 truncate">{amigo.nome}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {seguindo.length > 0 && (
                <>
                  <h3 className="text-xs font-bold text-neutral-500 uppercase mt-4 mb-2">
                    Seguindo ({seguindo.length})
                  </h3>
                  <ul className="space-y-2">
                    {seguindo.map((s) => (
                      <li key={s.id}>
                        <Link
                          to={`/perfil/${s.id}`}
                          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-neutral-50 transition"
                        >
                          <Avatar src={s.fotoUrl} alt={s.nome} size="sm" />
                          <span className="text-sm text-neutral-700 truncate">{s.nome}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Card>

          {/* Cães */}
          <Card className="shadow-sm overflow-hidden" padding="p-0">
            <div className="bg-instadog-100 border-b border-instadog-200 px-4 py-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-instadog-800">Meus cães</h2>
              {ehMeuPerfil && (
                <Link to="/cadastro-cao" className="text-xs text-instadog-700 hover:underline">
                  + adicionar
                </Link>
              )}
            </div>
            <div className="p-4">
              {caos.length === 0 && (
                <p className="text-sm text-neutral-500">Nenhum cão cadastrado.</p>
              )}
              <ul className="space-y-3">
                {caos.map((cao) => (
                  <li key={cao.id} className="flex items-center gap-3">
                    {cao.fotoUrl ? (
                      <img
                        src={cao.fotoUrl}
                        alt={`Foto de ${cao.nome}`}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center">
                        <span>🐶</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 text-sm">{cao.nome}</p>
                      <p className="text-xs text-neutral-600">
                        {cao.raca || ''} {cao.raca && cao.porte ? '•' : ''} {cao.porte || ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {ehMeuPerfil && (
            <button
              onClick={handleExcluirConta}
              disabled={excluindo}
              className="w-full py-2.5 bg-error-500 text-white rounded-lg font-medium hover:bg-error-600 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-error-300 text-sm"
            >
              {excluindo ? 'Excluindo...' : 'Excluir minha conta'}
            </button>
          )}
        </div>

        {/* ---------- Coluna direita: mural de recados ---------- */}
        <div>
          <Card className="shadow-sm overflow-hidden" padding="p-0">
            <div className="bg-instadog-600 px-4 py-2.5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Scraps</h2>
              <span className="text-xs text-instadog-100">{totalScraps} recados</span>
            </div>

            {/* Formulário para deixar recado */}
            {!ehMeuPerfil && (
              <form onSubmit={handleEnviarScrap} className="p-4 border-b border-neutral-100 bg-neutral-50">
                <textarea
                  value={textoScrap}
                  onChange={(e) => setTextoScrap(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder={`Deixar um recado para ${perfil.nome}...`}
                  aria-label="Texto do recado"
                  className="block w-full px-3 py-2 text-sm text-neutral-900 border border-neutral-300 rounded-lg bg-white focus:ring-2 focus:ring-instadog-500 focus:border-transparent outline-none transition"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-neutral-500">{textoScrap.length}/500</span>
                  <Button type="submit" size="sm" loading={enviandoScrap} disabled={!textoScrap.trim()}>
                    Deixar recado
                  </Button>
                </div>
              </form>
            )}

            {/* Lista de recados */}
            <div className="divide-y divide-neutral-100">
              {scraps.length === 0 && (
                <p className="p-6 text-sm text-neutral-500 text-center">
                  Nenhum recado por aqui ainda.
                  {!ehMeuPerfil && ' Seja a primeira pessoa a deixar um!'}
                </p>
              )}
              {scraps.map((scrap) => (
                <div key={scrap.id} className="p-4 hover:bg-neutral-50/60 transition">
                  <div className="flex items-start gap-3">
                    <Link to={`/perfil/${scrap.autorId}`}>
                      <Avatar src={scrap.autorFotoUrl} alt={scrap.autorNome} size="sm" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <Link
                          to={`/perfil/${scrap.autorId}`}
                          className="font-semibold text-sm text-instadog-700 hover:underline"
                        >
                          {scrap.autorNome}
                        </Link>
                        <span className="text-xs text-neutral-400">
                          {new Date(scrap.criadoEm).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </span>
                        {scrap.autorId === user?.id && (
                          <button
                            onClick={() => handleExcluirScrap(scrap.id)}
                            className="ml-auto text-xs text-neutral-400 hover:text-error-600 transition"
                            title="Apagar recado"
                          >
                            apagar
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 mt-1 whitespace-pre-wrap break-words">
                        {scrap.texto}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ valor, rotulo }) {
  return (
    <div className="text-center py-3">
      <p className="text-xl font-bold text-instadog-700">{valor}</p>
      <p className="text-[11px] uppercase tracking-wide text-neutral-500">{rotulo}</p>
    </div>
  );
}
