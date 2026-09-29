import { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header.jsx";
import { ProductContext } from '../context/ProductContext.jsx';
import { agregarItem } from '../services/api.js';

export const Home = () => {
  const navigate = useNavigate();
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

      <section
        className="relative overflow-hidden rounded-2xl bg-neutral-900 bg-cover bg-right border border-neutral-800 p-8"
        style={{ backgroundImage: "url('/bannerr.jfif')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-900/30 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-md space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Armá tu PC
          </h2>
          <p className="text-sm text-neutral-200 drop-shadow">
            Elegí componentes 100% compatibles y armala a tu medida.
          </p>
          <a
            href="#catalogo"
            className="inline-block rounded-lg bg-slate-600 hover:bg-slate-500 px-5 py-2.5 text-xs font-semibold text-white transition shadow-md"
          >
            Ver Productos
          </a>
        </div>
      </section>

      <section className="my-8 px-2">
        <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
          <span>🔥</span> Productos Destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.slice(0, 3).map((producto, index) => {

            const imagenesReales = [
              "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80",
              "https://www.comeros.com.ar/wp-content/uploads/2026/07/f7d3a024-e447-4bac-aeff-d7d3db01d7e3-1000x1000.webp",
              "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80"
            ];

            const imagenUrl = producto.imagenes?.[0]?.url || imagenesReales[index % imagenesReales.length];

            return (
              <div key={producto.id || index} className="border border-slate-200 rounded-xl p-4 shadow-md bg-white flex flex-col justify-between">
                <div>
                  <div className="w-full h-40 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                    <img
                      src={imagenUrl}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {producto.nombre}
                  </h3>

                  <p className="text-emerald-600 font-extrabold text-lg mt-2">
                    ${Number(producto.precio).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const idValido = producto.id || producto.id_producto || producto._id;
                    if (idValido) {
                      navigate(`/productos/${idValido}`);
                    }
                  }}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition shadow-sm cursor-pointer" >
                  Ver Detalle
                </button>
              </div>
            );
          })}
        </div>
      </section >

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
            {productosPaginados.map((prod, index) => {
              const mapaImagenes = {
                "Procesador AMD Ryzen 3 4100": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80",
                "Intel Core i9-14900Kf": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQug8ueaDyOZ95OUf0rADnt1fGczgn0xbJSQ6mStcmTA9cz503FJci0rs8&s=10",
                "Placa de Video ASUS RTX 4070 Dual 12GB": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80",
                "Procesador AMD Ryzen 5 5600X": "https://www.venex.com.ar/products_images/1755777303_6.jpg",
                "Motherboard ASUS Prime B550M-A": "https://www.maximus.com.ar/Temp/App_WebSite/App_PictureFiles/Items/90MB1GC0-M0EAY0.jpg",
                "Motherboard Gigabyte Z790 AORUS ELITE":"https://http2.mlstatic.com/D_NQ_NP_659758-MLU54963368222_042023-O.webp",
                "Placa de Video AMD Radeon RX 7600 XT 16GB": "https://fullh4rd.com.ar/img/productos/3/placa-de-video-radeon-rx-7600-xt-16gb-asus-tuf-gaming--oc-3.jpg",
                "Memoria RAM DDR5 16GB Corsair Vengeance":"https://fullh4rd.com.ar/img/productos/4/memoria-16gb-ddr5-5200-corsair-vengeance-expo-xmp-0.jpg",
                "Disco SSD NVMe M.2 1TB WD Black SN770":"https://http2.mlstatic.com/D_Q_NP_2X_972472-MLA95934827361_102025-T.webp",
                "Fuente Corsair RM750e 750W": "https://fullh4rd.com.ar/img/productos/26/fuente-750w-corsair-rm750e-80-plus-gold-bajo-ruido-fully-modular-0.jpg",
                "Gabinete Lian Li Lancool 216 RGB": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWTwZG3n_UZAMDKFao0iKpaoSm0KlxC9PWROycsn6VrnvxuIHmr2zFkk_L&s=10",
                "Memoria RAM DDR4 32GB Kingston Fury":"https://fullh4rd.com.ar/img/productos/4/memoria-32gb-ddr4-3200-kingston-fury-beast-rgb-0.jpg",

              };
              const imagenUrl = prod.imagenes?.[0]?.url || prod.imagen || mapaImagenes[prod.nombre] || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80";
              const productoId = prod.id || prod._id;

              return (
                <div
                  key={productoId}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 shadow-sm"
                >
                  <div>
                    <Link to={`/productos/${productoId}`} className="block group">
                      <div className="mb-3 flex h-40 w-full items-center justify-center rounded-lg bg-slate-100 overflow-hidden">

                        <img
                          src={imagenUrl}
                          alt={prod.nombre}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm group-hover:text-slate-600 transition">
                        {prod.nombre}
                      </h4>
                    </Link>

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
                    <button
                      onClick={() =>
                        agregarItem({ idProducto: productoId, cantidad: 1 })
                      }
                      className="rounded-lg bg-slate-600 px-3 py-1.5 text-xs border border-slate-600 font-semibold text-white transition hover:bg-slate-500 cursor-pointer"
                    >
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

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
              (numeroPagina) => (
                <button
                  key={numeroPagina}
                  onClick={() => setPaginaActual(numeroPagina)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${paginaActual === numeroPagina
                    ? "bg-slate-700 text-white"
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                >
                  {numeroPagina}
                </button>
              ),
            )}

            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </div >
  );
};

export default Home;