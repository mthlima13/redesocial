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
  const [imagemUrl, setImagemUrl] = useState('');
  const [caos, setCaos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [erro, setErro] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Lista cães do usuário (endpoint simplificado retorna 1)
    caoService.buscarPorId(1).then((res) => {
      if (res.data) setCaos([res.data]);
    }).catch(() => {
      // Ignora erro se não houver cães ainda
    });
  }, []);

  const handleImagemChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErro('Por favor, selecione apenas arquivos de imagem');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErro('A imagem deve ter no máximo 10MB');
      return;
    }
    setImagem(file);
    setImagemUrl(URL.createObjectURL(file));
    setPreview(URL.createObjectURL(file));
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      let urlFinal = imagemUrl;

      // Se há arquivo novo, faz upload no back-end primeiro
      if (imagem && !imagemUrl.startsWith('http')) {
        setUploadando(true);
        const res = await postService.uploadImagem(imagem);
        urlFinal = res.data.url;
      }

      await postService.criar({ caoId: Number(caoId), descricao, imagemUrl: urlFinal });
      navigate('/feed');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao criar post');
    } finally {
      setCarregando(false);
      setUploadando(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Criar post 📸</h2>
          <button
            onClick={() => navigate('/feed')}
            className="text-sm text-gray-600 hover:text-instadog-600"
          >
            Cancelar
          </button>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escolha o cão
            </label>
            <select
              className="input-field"
              value={caoId}
              onChange={(e) => setCaoId(e.target.value)}
              required
            >
              <option value="">Selecione um cão</option>
              {caos.map((cao) => (
                <option key={cao.id} value={cao.id}>
                  {cao.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              className="input-field"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="O que seu cão está aprontando?"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto (opcional)
            </label>
            <div className="flex items-center gap-3">
              <input
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                  file:text-sm file:font-semibold file:bg-instadog-50 file:text-instadog-700
                  hover:file:bg-instadog-100"
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
              />
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagem(null);
                      setImagemUrl('');
                      setPreview(null);
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remover"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            {uploadando && (
              <p className="text-xs text-gray-500 mt-1">Enviando imagem...</p>
            )}
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
