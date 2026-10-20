import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Restaura a sessão ao carregar a página (F5): o token continua no
  // localStorage, mas o usuário precisa ser recarregado da API.
  useEffect(() => {
    let cancelado = false;

    const restaurarSessao = async () => {
      const tokenArmazenado = localStorage.getItem('token');
      if (!tokenArmazenado) {
        if (!cancelado) setLoading(false);
        return;
      }

      try {
        const res = await api.get('/usuarios/perfil');
        if (!cancelado) setUser(res.data);
      } catch (e) {
        // Token inválido ou expirado: encerra a sessão silenciosamente
        localStorage.removeItem('token');
        if (!cancelado) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };

    restaurarSessao();

    return () => {
      cancelado = true;
    };
  }, []);

  const login = async (email, senha) => {
    const res = await api.post('/auth/login', { email, senha });
    const { token: tk, usuario } = res.data;
    localStorage.setItem('token', tk);
    setToken(tk);
    setUser(usuario);
  };

  const cadastro = async (dados) => {
    const res = await api.post('/auth/cadastro', dados);
    return res.data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const atualizarPerfil = async (dados) => {
    const res = await api.put('/usuarios/perfil', dados);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, cadastro, logout, atualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
