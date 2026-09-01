import Cards from '../components/cards.jsx';
import Header from '../components/Header.jsx';

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { ProductContext } from '../context/ProductContext.jsx';

export const Home = () => {
  const { usuario, logout } = useContext(UserContext);
  const { productos = [] } = useContext(ProductContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    navigate('/login');
  };

  return (
    <div className="space-y-8 text-slate-100">
      <header className="flex items-center justify-between rounded-xl bg-neutral-900 px-6 py-4 border border-neutral-800">
        <h1 className="text-lg font-medium text-slate-200">
          Hola, <span className="font-bold text-white">{usuario?.nombre || 'Usuario'}</span>
        </h1>
        <button
          onClick={handleLogout}
          type="button"
          className="rounded-lg bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-red-600 hover:text-white cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </header>

      <section className="rounded-2xl bg-neutral-900 p-8 border border-neutral-800">
        <div className="max-w-md space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Armá tu PC
          </h2>
          <p className="text-xs text-neutral-400">
            Componentes compatibles.
          </p>
          <a
            href="#catalogo"
            className="inline-block rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            Ver Productos
          </a>
        </div>
      </section>

      <section id="catalogo" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
            Catálogo
          </h3>
          <span className="text-xs text-neutral-500">{productos.length} items</span>
        </div>

        {productos.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center text-xs text-neutral-500">
            Sin productos disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((prod) => {
              const imagenUrl = prod.imagenes?.[0]?.url || prod.imagen || null;

              return (
                <div
                  key={prod.id || prod._id}
                  className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-700"
                >
                  <div>
                    <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg bg-neutral-950 overflow-hidden">
                      {imagenUrl ? (
                        <img
                          src={imagenUrl}
                          alt={prod.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-neutral-600">Sin Imagen</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-white text-sm">
                      {prod.nombre}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-400">
                      {prod.descripcion || 'Sin descripción.'}
                    </p>
                    {prod.socketCompatibilidad && (
                      <span className="mt-2 inline-block rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
                        Socket: {prod.socketCompatibilidad}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-3">
                    <span className="text-base font-bold text-white">
                      ${Number(prod.precio).toLocaleString()}
                    </span>
                    <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">
                      Agregar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};




export default Home;