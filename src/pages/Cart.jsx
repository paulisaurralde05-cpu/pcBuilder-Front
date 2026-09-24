import { useState, useEffect } from 'react';
import { obtenerItems, agregarItem, eliminarItem } from '../services/api.js';
import { ShoppingCart, Trash } from 'lucide-react';
import Header from '../components/Header.jsx';
import img2 from '../assets/products/img2.jpg';

function Cart() {
  const [carrito, setCarrito] = useState(null);

  const fetchCarrito = async () => {
    try {
      const data = await obtenerItems('carrito');
      setCarrito(data);
    } catch (error) {
      console.error('ERROR:', error.message);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  const handleModificarCantidad = async (idProducto, cantidad) => {
    try {
      await agregarItem({ idProducto, cantidad });
      await fetchCarrito();
    } catch (error) {
      console.error('Error al actualizar cantidad:', error.message);
    }
  };

  const handleEliminar = async (idProducto) => {
    try {
      await eliminarItem('carrito/eliminar', idProducto);
      await fetchCarrito();
    } catch (error) {
      console.error('Error al eliminar ítem:', error.message);
    }
  };

  const totalProductos = carrito?.items?.reduce((acc, item) => acc + item.cantidad, 0) || 0;
  const totalPrecio = carrito?.items?.reduce((acc, item) => acc + (Number(item.producto.precio) * item.cantidad), 0) || 0;

  return (
    <div className='p-6 bg-slate-600 min-h-screen'>
      <Header />
      <h1 className='font-bold text-2xl text-white p-5 mb-5 flex gap-2 items-center'>
        <ShoppingCart size={30} /> Carrito de Compras
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <div className="overflow-x-auto bg-slate-400 p-10 rounded-lg">
            <div className="min-w-[680px] grid grid-cols-[90px_minmax(180px,1fr)_120px_160px_48px] items-center gap-4 px-2 pb-3 text-sm font-semibold uppercase tracking-wide text-gray-100">
              <span aria-hidden="true" />
              <span>Nombre</span>
              <span>Precio</span>
              <span>Cantidad</span>
              <span aria-hidden="true" />
            </div>

            <div className="min-w-[680px] space-y-4">
              {!carrito?.items || carrito.items.length === 0 ? (
                <p className="text-gray-100 text-center py-6 font-medium">El carrito está vacío.</p>
              ) : (
                carrito.items.map(item => (
                  <article key={item.id} className="grid grid-cols-[90px_minmax(180px,1fr)_120px_160px_48px] items-center gap-4 rounded-lg bg-gray-200 p-4">
                    <img src={img2} width={90} className="rounded object-cover" alt={item.producto.nombre} />
                    <h3 className="truncate font-medium">{item.producto.nombre}</h3>
                    <p className="w-16 text-right tabular-nums font-semibold">${Number(item.producto.precio).toFixed()}</p>

                    <div className="flex items-center gap-4 bg-white px-3 py-1 rounded-md border border-gray-300 w-fit">
                      <button
                        type="button"
                        className='hover:cursor-pointer font-bold px-1 text-slate-700 hover:text-red-600'
                        aria-label="Disminuir cantidad"
                        onClick={() => handleModificarCantidad(item.idProducto, -1)}
                      >
                        -
                      </button>
                      <p className="font-semibold text-slate-800">{item.cantidad}</p>
                      <button
                        type="button"
                        className='hover:cursor-pointer font-bold px-1 text-slate-700 hover:text-green-600'
                        aria-label="Aumentar cantidad"
                        onClick={() => handleModificarCantidad(item.idProducto, 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className='hover:bg-red-500 hover:text-white rounded-full p-2 w-9 h-9 flex items-center justify-center transition hover:cursor-pointer text-gray-700'
                      onClick={() => handleEliminar(item.idProducto)}
                      title="Eliminar producto"
                    >
                      <Trash size={18} />
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <div className='sticky top-24 h-fit rounded-lg p-6 lg:col-start-3 lg:row-start-1 bg-slate-400 text-gray-100'>
          <div className='bg-gray-950 rounded-lg p-5 flex flex-col gap-3'>
            <h2 className='text-center font-bold text-xl border-b border-gray-800 pb-2 mb-1'>Resumen</h2>
            <div className='flex justify-between items-center text-sm'>
              <span className='text-gray-400'>Cantidad de ítems:</span>
              <span className='font-semibold'>{totalProductos}</span>
            </div>
            <div className='flex justify-between items-center text-lg font-bold text-white pt-2 border-t border-gray-800'>
              <span>Total:</span>
              <span className='text-emerald-400'>${totalPrecio.toLocaleString()}</span>
            </div>
          </div>
          <button className='text-white font-bold text-center w-full p-4 bg-blue-600 hover:bg-blue-700 transition mt-4 rounded-xl cursor-pointer shadow-md'>
            Pagar con Mercado Pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;