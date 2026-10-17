import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { User, LogOut, Bell, Plus } from 'lucide-react';
import Button from './ui/Button.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Logo className="w-7 h-7 text-instadog-600" />
            <span className="font-bold text-xl text-instadog-600 tracking-tight">InstaDog</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/feed" className="nav-link">
              Feed
            </Link>
            {user && (
              <Link to="/perfil" className="nav-link">
                <User className="w-4 h-4 mr-1.5" /> Perfil
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="btn-outline btn-sm">Entrar</Link>
                <Link to="/cadastro" className="btn-primary btn-sm">Cadastrar</Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/criar-post')}
                  className="btn-icon"
                  title="Nova publicação"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={logout}
                  className="btn-icon text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
