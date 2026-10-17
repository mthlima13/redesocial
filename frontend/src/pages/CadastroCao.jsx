import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { caoService } from '../services/usuarios';

export default function CadastroCao() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    raca: '',
    dataNascimento: '',
    porte: '',
    bio: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await caoService.cadastrar(form);
      navigate('/perfil');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao cadastrar cão');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4">
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cadastrar cão 🐶</h2>
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {erro}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              className="input-field"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Rex"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Raça</label>
            <input
              className="input-field"
              value={form.raca}
              onChange={(e) => setForm({ ...form, raca: e.target.value })}
              placeholder="Vira-lata"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de nascimento</label>
            <input
              className="input-field"
              type="date"
              value={form.dataNascimento}
              onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Porte</label>
            <select
              className="input-field"
              value={form.porte}
              onChange={(e) => setForm({ ...form, porte: e.target.value })}
            >
              <option value="">Selecione</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              className="input-field"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              placeholder="Conte um pouco sobre seu cão"
            />
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="btn-primary w-full"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar cão'}
          </button>
        </form>
      </div>
    </div>
  );
}
