import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Logo } from '../components/Logo';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Logo className="mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">Criar conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Junte-se ao InstaDog com seu cão 🐾
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome completo</label>
              <input
                className="input-field focus-visible-ring"
                name="nome"
                required
                value={dados.nome}
                onChange={handleChange}
                placeholder="João Silva"
                aria-label="Nome completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                className="input-field focus-visible-ring"
                name="email"
                type="email"
                required
                value={dados.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                aria-label="E-mail"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                className="input-field focus-visible-ring"
                name="senha"
                type="password"
                required
                minLength={6}
                value={dados.senha}
                onChange={handleChange}
                placeholder="••••••••"
                aria-label="Senha"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cidade (opcional)</label>
              <input
                className="input-field focus-visible-ring"
                name="cidade"
                value={dados.cidade}
                onChange={handleChange}
                placeholder="São Paulo"
                aria-label="Cidade"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio (opcional)</label>
              <textarea
                className="input-field focus-visible-ring"
                name="bio"
                value={dados.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre você e seus cães"
                rows={3}
                aria-label="Bio"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn-primary w-full"
          >
            {carregando ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-instadog-600 hover:text-instadog-500 focus:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
