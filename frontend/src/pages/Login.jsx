import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Card from '../components/ui/Card.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const { sucesso, erro } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      await login(email, senha);
      sucesso('Bem-vindo de volta!');
      navigate('/feed');
    } catch (err) {
      erro(err.response?.data?.mensagem || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <Card className="max-w-md w-full shadow-lg mx-auto" padding="p-8 sm:p-10">
        <div className="text-center mb-8">
          <Logo className="mx-auto w-10 h-10 text-instadog-600" />
          <h2 className="mt-6 text-3xl font-bold text-neutral-900 tracking-tight">Entrar no InstaDog</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Conecte-se com tutores e seus cães 🐾
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="senha"
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="font-medium text-instadog-600 hover:text-instadog-700">
            Cadastre-se
          </Link>
        </p>
      </Card>
    </div>
  );
}
