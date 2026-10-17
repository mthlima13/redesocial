import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { Bell, User, Plus, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Logo className="w-7 h-7 text-instadog-600" />
            <span className="font-bold text-xl text-instadog-600 tracking-tight">InstaDog</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/feed" className="text-gray-600 hover:text-instadog-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition">
              Feed
            </Link>
            {user && (
              <>
                <Link to="/perfil" className="text-gray-600 hover:text-instadog-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                  <User className="w-4 h-4 mr-1" /> Perfil
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="btn-outline">Entrar</Link>
                <Link to="/cadastro" className="btn-primary">Cadastrar</Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => logout()}
                  className="text-gray-600 hover:text-instadog-600"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
