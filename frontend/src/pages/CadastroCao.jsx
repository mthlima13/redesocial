import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { caoService } from '../services/usuarios';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Card from '../components/ui/Card.jsx';

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
    <div className="max-w-lg mx-auto py-8 px-4">
      <Card className="shadow-lg" padding="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🐶</span>
          <h2 className="text-2xl font-bold text-neutral-900">Cadastrar cão</h2>
        </div>

        {erro && (
          <div className="bg-error-50 border border-error-100 text-error-700 px-4 py-3 rounded-lg text-sm mb-6">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nome"
            placeholder="Rex"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <Input
            label="Raça"
            placeholder="Vira-lata"
            value={form.raca}
            onChange={(e) => setForm({ ...form, raca: e.target.value })}
          />
          <Input
            label="Data de nascimento"
            type="date"
            value={form.dataNascimento}
            onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
          />
          <div>
            <label className="label" htmlFor="porte">Porte</label>
            <select
              id="porte"
              className="input"
              value={form.porte}
              onChange={(e) => setForm({ ...form, porte: e.target.value })}
            >
              <option value="">Selecione</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
          <Input
            label="Bio"
            as="textarea"
            rows={3}
            placeholder="Conte um pouco sobre seu cão"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar cão'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
