import '../styles/user/header.css';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between rounded-xl bg-white px-6 py-4 border border-slate-700">
      <h1 className="text-lg font-medium text-slate-700">
        Hola, <span className="font-bold text-slate-800">{user?.nombre || 'Usuario'}</span>
      </h1>

      <ul className="flex items-center gap-6 text-lg font-medium">
        <li className="text-slate-700 hover:text-slate-900 transition">
          <Link to="/home">Inicio</Link>
        </li>
        <li className="text-slate-700 hover:text-slate-900 transition">
          <Link to="/nosotros">Nosotros</Link>
        </li>
        <li className="text-slate-700 hover:text-slate-900 transition">
          <Link to="/carrito" title="Ver Carrito" className="flex items-center">
            
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 stroke-slate-700 hover:stroke-slate-900 transition" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </Link>
        </li>
      </ul>

      {user ? (
        <button
          onClick={handleLogout}
          type="button"
          className="rounded-lg bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-red-600 hover:text-white cursor-pointer"
        >
          Cerrar Sesión
        </button>
      ) : (
        <Link
          to="/login"
          className="rounded-lg bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-red-600 hover:text-white cursor-pointer"
        >
          Iniciar Sesión
        </Link>
      )}
    </header>
  );
}

export default Header;