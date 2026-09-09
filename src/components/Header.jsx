import '../styles/user/header.css';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx';
import { Link } from 'react-router-dom';
function Header() {
  const { user, logout } = useContext(UserContext);
  console.log('usuario en header:', user);
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

      <ul className="flex items-center gap-4 text-lg font-medium ">
        <li className='text-slate-700'><Link to="/home">Inicio</Link></li>
        <li className='text-slate-700'><Link to="/nosotros">Nosotros</Link></li>
        <li className='text-slate-700'><Link to="/carrito">Carrito</Link></li>
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


  )
}

export default Header