import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { postService } from '../services/posts';
import { uploadService } from '../services/upload';
import { caoService } from '../services/usuarios';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Card from '../components/ui/Card.jsx';

export default function CriarPost() {
  const { user } = useAuth();
  const { sucesso, erro } = useToast();
  const navigate = useNavigate();
  const [caoId, setCaoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [imagemUrl, setImagemUrl] = useState('');
  const [caos, setCaos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    caoService.listarMeus()
      .then((res) => setCaos(res.data || []))
      .catch((e) => console.error(e));
  }, []);

  const handleImagemChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      erro('Por favor, selecione apenas arquivos de imagem');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      erro('A imagem deve ter no máximo 10MB');
      return;
    }
    setImagem(file);
    setImagemUrl(URL.createObjectURL(file));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      let urlFinal = imagemUrl;

      // Se há arquivo novo, faz upload no back-end primeiro
      if (imagem) {
        setUploadando(true);
        const res = await uploadService.enviar(imagem);
        urlFinal = res.data.url;
      }

      await postService.criar({ caoId: Number(caoId), descricao, imagemUrl: urlFinal });
      sucesso('Post publicado com sucesso');
      navigate('/feed');
    } catch (err) {
      erro(err.response?.data?.mensagem || 'Erro ao criar post');
    } finally {
      setCarregando(false);
      setUploadando(false);
    }
  };

  const removerImagem = () => {
    setImagem(null);
    setImagemUrl('');
    setPreview(null);
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <Card className="shadow-lg" padding="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Criar post 📸</h2>
          <button
            onClick={() => navigate('/feed')}
            className="text-sm text-neutral-600 hover:text-instadog-600 hover:underline"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label" htmlFor="caoId">Escolha o cão</label>
            <select
              id="caoId"
              className="input"
              value={caoId}
              onChange={(e) => setCaoId(e.target.value)}
              required
              aria-label="Selecionar cão"
            >
              <option value="">Selecione um cão</option>
              {caos.map((cao) => (
                <option key={cao.id} value={cao.id}>
                  {cao.nome}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Descrição"
            as="textarea"
            rows={3}
            placeholder="O que seu cão está aprontando?"
            maxLength={500}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            aria-label="Descrição do post"
          />

          <div>
            <label className="label" htmlFor="foto">Foto (opcional)</label>
            <div className="flex items-center gap-3">
              <input
                id="foto"
                className="block w-full text-sm text-neutral-500
                  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                  file:text-sm file:font-semibold file:bg-instadog-50 file:text-instadog-700
                  hover:file:bg-instadog-100 focus:outline-none"
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                aria-label="Enviar foto"
              />
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Pré-visualização da imagem"
                    className="w-32 h-32 rounded-lg object-cover border border-neutral-300"
                  />
                  <button
                    type="button"
                    onClick={removerImagem}
                    className="absolute -top-1 -right-1 bg-error-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-error-600 focus:outline-none focus:ring-2 focus:ring-error-500"
                    title="Remover imagem"
                    aria-label="Remover imagem"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            {uploadando && (
              <p className="text-xs text-neutral-500 mt-1">Enviando imagem...</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={carregando || !caoId}
            loading={carregando || uploadando}
          >
            {carregando || uploadando ? 'Publicando...' : 'Publicar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
