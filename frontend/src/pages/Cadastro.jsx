import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Card from '../components/ui/Card.jsx';

export default function Cadastro() {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    cidade: '',
    bio: '',
  });
  const [carregando, setCarregando] = useState(false);
  const { cadastro, login } = useAuth();
  const { sucesso, erro } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      await cadastro(dados);
      await login(dados.email, dados.senha);
      sucesso('Conta criada com sucesso!');
      navigate('/feed');
    } catch (err) {
      erro(err.response?.data?.mensagem || 'Erro ao cadastrar');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <Card className="max-w-md w-full shadow-lg mx-auto" padding="p-8 sm:p-10">
        <div className="text-center mb-8">
          <Logo className="mx-auto w-10 h-10 text-instadog-600" />
          <h2 className="mt-6 text-3xl font-bold text-neutral-900 tracking-tight">Criar conta</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Junte-se ao InstaDog com seu cão 🐾
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="nome"
            label="Nome completo"
            name="nome"
            placeholder="João Silva"
            value={dados.nome}
            onChange={handleChange}
            required
          />
          <Input
            id="email"
            label="E-mail"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={dados.email}
            onChange={handleChange}
            required
          />
          <Input
            id="senha"
            label="Senha"
            name="senha"
            type="password"
            placeholder="••••••••"
            minLength={6}
            value={dados.senha}
            onChange={handleChange}
            required
          />
          <Input
            id="cidade"
            label="Cidade (opcional)"
            name="cidade"
            placeholder="São Paulo"
            value={dados.cidade}
            onChange={handleChange}
          />
          <Input
            id="bio"
            label="Bio (opcional)"
            name="bio"
            as="textarea"
            rows={3}
            placeholder="Conte um pouco sobre você e seus cães"
            value={dados.bio}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={carregando}
          >
            {carregando ? 'Cadastrando...' : 'Criar conta'}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-instadog-600 hover:text-instadog-700">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
