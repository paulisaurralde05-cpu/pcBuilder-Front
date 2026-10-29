import { useEffect, useState } from 'react';
import { agregarItem, eliminarItem, confirmarPedido } from '../services/api.js';
import Header from '../components/Header.jsx';
import { useCart } from '../context/CartContext.jsx'; 
import { Trash, ShoppingCart } from 'lucide-react';

function Cart() {

  const { carrito, fetchCarrito } = useCart();
  const [confirmandoPedido, setConfirmandoPedido] = useState(false);
  const [mensajePedido, setMensajePedido] = useState('');
  const [errorPedido, setErrorPedido] = useState('');

  useEffect(() => {
    fetchCarrito();
  }, []);

  // controlador de pedido, hace el post, crea el pedido, vacía el carrito
  const handleConfirmarPedido = async () => {
    setConfirmandoPedido(true);
    setMensajePedido('');
    setErrorPedido('');

    try {
      await confirmarPedido();
      setMensajePedido('Pedido confirmado correctamente.');
      await fetchCarrito();
    } catch (error) {
      setErrorPedido(error.message || 'No se pudo confirmar el pedido.');
    } finally {
      setConfirmandoPedido(false);
    }
  };

  const handleModificarCantidad = async (idProducto, cambio, cantidadActual, stock) => {
    if (cambio > 0 && cantidadActual >= stock) {
      return;
    }

    try {
      await agregarItem({ idProducto, cantidad: cambio });
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

  const listaItems = carrito?.detalles || carrito?.items || [];

  const totalProductos = listaItems.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = listaItems.reduce(
    (acc, item) => acc + Number(item.producto.precio) * item.cantidad,
    0
  );

  return (
    <div className="p-6 bg-slate-600 min-h-screen">
      <Header />

      <h1 className="font-bold text-2xl text-white p-5 mb-5 flex gap-2 items-center">
        <ShoppingCart size={28} /> Carrito de Compras
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <div className="overflow-x-auto bg-slate-400 p-6 md:p-10 rounded-lg">
            <div className="min-w-[720px] grid grid-cols-[80px_minmax(160px,1fr)_100px_140px_110px_40px] items-center gap-3 px-2 pb-3 text-xs md:text-sm font-semibold uppercase tracking-wide text-gray-100">
              <span aria-hidden="true" />
              <span>Nombre</span>
              <span>Precio Un.</span>
              <span className="text-center">Cantidad</span>
              <span className="text-right">Subtotal</span>
              <span aria-hidden="true" />
            </div>

            <div className="min-w-[720px] space-y-4">
              {listaItems.length === 0 ? (
                <p className="text-gray-100 text-center py-6 font-medium">
                  El carrito está vacío.
                </p>
              ) : (
                listaItems.map((item) => {
                  const stockMax = item.producto.stock;
                  const alcanzoLimite = item.cantidad >= stockMax;
                  const precioUnitario = Number(item.producto.precio);
                  const subtotalProducto = precioUnitario * item.cantidad;

                  return (
                    <article
                      key={item.id || item.idProducto}
                      className="grid grid-cols-[80px_minmax(160px,1fr)_100px_140px_110px_40px] items-center gap-3 rounded-lg bg-gray-200 p-4 shadow-sm"
                    >
                      {/* Imagen */}
                      <img
                        src={item.producto.imagen}
                        width={80}
                        className="rounded object-cover h-16 w-20"
                        alt={item.producto.nombre}
                      />

                      {/* Nombre y detalles */}
                      <div>
                        <h3 className="truncate font-semibold text-slate-900 text-sm">
                          {item.producto.nombre}
                        </h3>
                        <span className="text-[11px] text-slate-600 font-semibold block mt-0.5">
                          Stock disp: {stockMax}
                        </span>
                      </div>

                      {/* Precio Unitario */}
                      <p className="tabular-nums font-medium text-slate-700 text-sm">
                        ${precioUnitario.toLocaleString('es-AR')}
                      </p>

                      {/* Selector de Cantidad */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-3 bg-white px-2.5 py-1 rounded-md border border-gray-300 w-fit">
                          <button
                            type="button"
                            className="hover:cursor-pointer font-bold px-1 text-slate-700 hover:text-red-600"
                            aria-label="Disminuir cantidad"
                            onClick={() =>
                              handleModificarCantidad(
                                item.idProducto || item.productoId,
                                -1,
                                item.cantidad,
                                stockMax
                              )
                            }
                          >
                            -
                          </button>

                          <p className="font-semibold text-slate-800 text-sm">
                            {item.cantidad}
                          </p>

                          <button
                            type="button"
                            disabled={alcanzoLimite}
                            className={`font-bold px-1 ${
                              alcanzoLimite
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'hover:cursor-pointer text-slate-700 hover:text-green-600'
                            }`}
                            aria-label="Aumentar cantidad"
                            onClick={() =>
                              handleModificarCantidad(
                                item.idProducto || item.productoId,
                                1,
                                item.cantidad,
                                stockMax
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        {alcanzoLimite && (
                          <span className="text-[10px] font-bold text-red-600">
                            Máx. alcanzado
                          </span>
                        )}
                      </div>

                      {/* SUBTOTAL POR PRODUCTO */}
                      <div className="text-right">
                        <p className="tabular-nums font-bold text-emerald-700 text-base">
                          ${subtotalProducto.toLocaleString('es-AR')}
                        </p>
                      </div>

                      {/* Botón Eliminar */}
                      <button
                        type="button"
                        className="hover:bg-red-500 hover:text-white rounded-full p-2 w-8 h-8 flex items-center justify-center transition hover:cursor-pointer text-gray-700 justify-self-end"
                        onClick={() =>
                          handleEliminar(item.idProducto || item.productoId)
                        }
                        title="Eliminar producto"
                      >
                        <Trash size={16} />
                      </button>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Resumen de Compra */}
        <div className="sticky top-24 h-fit rounded-lg p-6 lg:col-start-3 lg:row-start-1 bg-slate-400 text-gray-100">
          <div className="bg-gray-950 rounded-lg p-5 flex flex-col gap-3">
            <h2 className="text-center font-bold text-xl border-b border-gray-800 pb-2 mb-1">
              Resumen
            </h2>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Cantidad de ítems:</span>
              <span className="font-semibold">{totalProductos}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Subtotal acumulado:</span>
              <span className="font-semibold">
                ${totalPrecio.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex justify-between items-center text-lg font-bold text-white pt-2 border-t border-gray-800">
              <span>Total a pagar:</span>
              <span className="text-emerald-400">
                ${totalPrecio.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {mensajePedido && (
            <p role="status" className="mt-4 text-center font-semibold text-emerald-900">
              {mensajePedido}
            </p>
          )}

          {errorPedido && (
            <p role="alert" className="mt-4 text-center font-semibold text-red-900">
              {errorPedido}
            </p>
          )}

          <button
            type="button"
            onClick={handleConfirmarPedido}
            disabled={confirmandoPedido || listaItems.length === 0}
            className="text-white font-bold text-center w-full p-4 bg-emerald-600 hover:bg-emerald-700 transition mt-4 rounded-xl cursor-pointer shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmandoPedido ? 'Confirmando pedido...' : 'Confirmar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;