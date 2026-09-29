import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { obtenerItemsXid, agregarItem, obtenerItems } from '../services/api.js';
import Header from '../components/Header.jsx';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agregado, setAgregado] = useState(false);
  const [errorStock, setErrorStock] = useState('');
  
  const [cantidad, setCantidad] = useState(1);
  const [cantidadEnCarrito, setCantidadEnCarrito] = useState(0);
  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const data = await obtenerItemsXid('productos', id);
      const productoEncontrado = data?.producto || (Array.isArray(data) ? data[0] : data);
      setProduct(productoEncontrado);

      const carritoData = await obtenerItems('carrito');
      const itemsCarrito = Array.isArray(carritoData) ? carritoData : (carritoData?.items || []);
      
      const itemEnCarrito = itemsCarrito.find(
        (item) => String(item.idProducto || item.productoId || item.id) === String(id)
      );

      setCantidadEnCarrito(itemEnCarrito ? itemEnCarrito.cantidad : 0);

    } catch (error) {
      console.error('Error al obtener datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      cargarDatos();
    }
  }, [id]);

  const stockDisponibleReal = product ? Math.max(0, product.stock - cantidadEnCarrito) : 0;

  const handleAgregar = async () => {
    setErrorStock('');

    if (cantidad > stockDisponibleReal) {
      setErrorStock(`No podés agregar esa cantidad. Ya tenés ${cantidadEnCarrito} en el carrito y el stock total es ${product.stock}.`);
      return;
    }

    try {
      const productoId = product.id || product._id || id;
      await agregarItem({ idProducto: productoId, cantidad });

      setCantidadEnCarrito((prev) => prev + cantidad);
      setCantidad(1);

      setAgregado(true);
      setTimeout(() => setAgregado(false), 2000);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3a4756] text-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-lg font-semibold">Cargando detalles del producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#3a4756] text-white">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-4">
          <p className="text-xl font-semibold">Producto no encontrado</p>
          <Link 
            to="/home" 
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3a4756] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10">
        <Link 
          to="/home" 
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition text-sm font-medium"
        >
          <span>← Volver al inicio</span>
        </Link>

        <div className="bg-white text-slate-800 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl">
          
          <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-6 min-h-[300px]">
            {product.imagen || product.imagenes?.[0]?.url ? (
              <img 
                src={product.imagen || product.imagenes?.[0]?.url} 
                alt={product.nombre} 
                className="max-h-80 object-contain rounded-lg"
              />
            ) : (
              <div className="text-slate-400 font-medium text-sm">Sin Imagen disponible</div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              {product.categoria?.nombre && (
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-2.5 py-1 rounded-md">
                  {product.categoria.nombre}
                </span>
              )}

              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-3">
                {product.nombre}
              </h1>

              <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                {product.descripcion || "Sin descripción detallada disponible."}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-extrabold text-slate-900">
                  ${Number(product.precio).toLocaleString('es-AR')}
                </span>
              </div>

              <div className="space-y-1 mb-4 text-sm">
                {stockDisponibleReal > 0 ? (
                  <p className="text-emerald-600 font-semibold">
                    Stock disponible: {stockDisponibleReal} unidades
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">
                    No queda stock disponible
                  </p>
                )}

                {cantidadEnCarrito > 0 && (
                  <p className="text-xs text-slate-500 font-medium">
                    (Hay {cantidadEnCarrito} productos en el carrito)
                  </p>
                )}
              </div>

              {stockDisponibleReal > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-xs font-semibold text-slate-600">Cantidad:</label>
                  <input 
                    type="number"
                    min="1"
                    max={stockDisponibleReal}
                    value={cantidad}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(stockDisponibleReal, Number(e.target.value)));
                      setCantidad(val);
                    }}
                    className="w-16 p-1.5 border border-slate-300 rounded-lg text-center text-sm font-semibold bg-slate-50 text-slate-800"
                  />
                </div>
              )}

              {errorStock && (
                <p className="text-xs text-red-600 font-bold mb-3">{errorStock}</p>
              )}

              <button
                onClick={handleAgregar}
                disabled={stockDisponibleReal <= 0}
                className={`w-full py-3.5 px-6 font-bold rounded-xl transition cursor-pointer shadow-md ${
                  agregado 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white'
                }`}
              >
                {stockDisponibleReal <= 0 
                  ? 'Sin Stock disponible' 
                  : agregado 
                    ? 'Agregado al carrito!' 
                    : 'Agregar al Carrito'
                }
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default ProductDetail;