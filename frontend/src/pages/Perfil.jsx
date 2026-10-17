import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usuarioService, caoService } from '../services/usuarios';

export default function Perfil() {
  const { user, logout, atualizarPerfil } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [caos, setCaos] = useState([]);
  const [edicao, setEdicao] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const res = await usuarioService.getPerfil();
      setPerfil(res.data);
      setForm({ ...res.data });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const res = await usuarioService.atualizarPerfil(form);
      setPerfil(res.data);
      setEdicao(false);
    } catch (e) {
      alert('Erro ao atualizar perfil');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{perfil?.nome || 'Perfil'}</h1>
          <p className="text-gray-600">{perfil?.cidade || ''}</p>
        </div>
        {!edicao ? (
          <button
            onClick={() => setEdicao(true)}
            className="btn-outline"
          >
            Editar perfil
          </button>
        ) : (
          <button
            onClick={() => setEdicao(false)}
            className="btn-outline"
          >
            Cancelar
          </button>
        )}
      </div>

      {edicao ? (
        <form onSubmit={handleSalvar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              className="input-field"
              value={form.nome || ''}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              className="input-field"
              value={form.cidade || ''}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              className="input-field"
              value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
            />
          </div>
          <button type="submit" className="btn-primary">Salvar</button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Sobre</h2>
            <p className="text-gray-600">{perfil?.bio || 'Sem bio ainda.'}</p>
            <p className="mt-2 text-sm text-gray-500">
              Membro desde {perfil?.criadoEm ? new Date(perfil.criadoEm).toLocaleDateString('pt-BR') : ''}
            </p>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Seus cães</h2>
            {caos.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhum cão cadastrado.</p>
            )}
            {caos.map((cao) => (
              <div key={cao.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">{cao.nome}</p>
                <p className="text-sm text-gray-600">{cao.raca || ''} • {cao.porte || ''}</p>
              </div>
            ))}
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              onClick={logout}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Excluir minha conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
