import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/posts';
import { caoService } from '../services/usuarios';

export default function CriarPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caoId, setCaoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [caos, setCaos] = useState([]);
  [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Busca cães do usuário (simplificado)
    setCaos([]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await postService.criar({ caoId: Number(caoId), descricao });
      navigate('/feed');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar post');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4">
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar post 📸</h2>
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {erro}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Escolha o cão</label>
            <select
              className="input-field"
              value={caoId}
              onChange={(e) => setCaoId(e.target.value)}
              required
            >
              <option value="">Selecione um cão</option>
              {caos.map((cao) => (
                <option key={cao.id} value={cao.id}>{cao.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              className="input-field"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="O que seu cão está aprontando?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Foto (opcional)</label>
            <input
              className="input-field"
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0] || null)}
            />
          </div>
          <button
            type="submit"
            disabled={carregando || !caoId}
            className="btn-primary w-full"
          >
            {carregando ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      </div>
    </div>
  );
}
