import { useState, useContext, useMemo } from 'react';
import Header from "../components/Header.jsx";
import { ProductContext } from '../context/ProductContext.jsx';
import { agregarItem } from '../services/api.js'
export const Home = () => {
  const { productos = [], categorias = [] } = useContext(ProductContext) || {};

  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 9;

  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());

      const coincideCategoria = categoriaSeleccionada === '' ||
        String(prod.categoryId || prod.categoriaId || prod.categoria) === String(categoriaSeleccionada);

      return coincideBusqueda && coincideCategoria;
    });
  }, [productos, busqueda, categoriaSeleccionada]);

  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina) || 1;
  const posicionInicio = (paginaActual - 1) * itemsPorPagina;
  const productosPaginados = productosFiltrados.slice(posicionInicio, posicionInicio + itemsPorPagina);

  const manejarCambioBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const manejarCambioCategoria = (e) => {
    setCategoriaSeleccionada(e.target.value);
    setPaginaActual(1);
  };

  return (
    <div className="space-y-8 text-slate-100 p-6 bg-slate-600 min-h-screen">
      <Header />

      <section className="rounded-2xl bg-white p-8 border border-neutral-800">
        <div className="max-w-md space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Armá tu PC
          </h2>
          <p className="text-xs text-slate-700">Componentes compatibles.</p>
          <a
            href="#catalogo"
            className="inline-block rounded-lg bg-green-700 hover:bg-green-600 px-4 py-2 text-xs font-semibold text-white transition"
          >
            Ver Productos
          </a>
        </div>
      </section>

      <section id="catalogo" className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
            <input
              type="text"
              placeholder="🔍︎ Buscar ..."
              value={busqueda}
              onChange={manejarCambioBusqueda}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-green-600 w-full sm:w-64"
            />

            <select
              value={categoriaSeleccionada}
              onChange={manejarCambioCategoria}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-green-600 cursor-pointer"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-semibold text-slate-600 self-end md:self-center">
            {productosFiltrados.length} resultados
          </span>
        </div>

        {productosPaginados.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-600">
            No se encontraron productos disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productosPaginados.map((prod) => {
              const imagenUrl = prod.imagenes?.[0]?.url || prod.imagen || null;

              return (
                <div
                  key={prod.id || prod._id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 shadow-sm"
                >
                  <div>
                    <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg bg-slate-100 overflow-hidden">
                      {imagenUrl ? (
                        <img
                          src={imagenUrl}
                          alt={prod.nombre}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">
                          Sin Imagen
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">
                      {prod.nombre}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      {prod.descripcion || "Sin descripción."}
                    </p>
                    {prod.socketCompatibilidad && (
                      <span className="mt-2 inline-block rounded bg-slate-600 px-2 py-0.5 text-[10px] text-white font-medium">
                        Socket: {prod.socketCompatibilidad}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-base font-bold text-slate-900">
                      ${Number(prod.precio).toLocaleString()}
                    </span>
                    <button onClick={() => agregarItem({idProducto: prod.id, cantidad: 1})} className="rounded-lg bg-slate-600 px-3 py-1.5 text-xs border border-slate-600 font-semibold text-white transition hover:bg-slate-500 cursor-pointer">
                      Agregar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
            >
              Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numeroPagina) => (
              <button
                key={numeroPagina}
                onClick={() => setPaginaActual(numeroPagina)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${paginaActual === numeroPagina
                  ? 'bg-slate-700 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {numeroPagina}
              </button>
            ))}

            <button
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;