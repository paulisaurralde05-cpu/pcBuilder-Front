
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Eye, X } from 'lucide-react';
import { obtenerItems, actualizarEstadoPedido } from '../services/api.js';
import { UserContext } from '../context/UserContext.jsx';
import AsideAdmin from './AsideAdmin.jsx';

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [actualizando, setActualizando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');

    // Busqueda y paginacion
    const [busqueda, setBusqueda] = useState('');
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const navigate = useNavigate();
    const { logout } = useContext(UserContext) || {};

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (logout) logout();

        navigate('/admin/login', { replace: true });
    };

    const cargarPedidos = useCallback(async () => {
        setCargando(true);
        setError('');

        try {
            const params = {
                pagina,
                limite,
            };
            if (busqueda.trim() !== '') {
                params.busqueda = busqueda.trim();
            }

            const respuesta = await obtenerItems('admin/pedidos', params);

            if (!respuesta || !Array.isArray(respuesta.pedidos)) {
                throw new Error('La respuesta de pedidos no tiene el formato esperado');
            }

            setPedidos(respuesta.pedidos);
            setTotal(respuesta.total || 0);
            setTotalPaginas(respuesta.totalPaginas || 1);

        } catch (errorCarga) {
            console.error('Error al obtener pedidos:', errorCarga);
            setError(errorCarga.message || 'No se pudieron cargar los pedidos');
        } finally {
            setCargando(false);
        }
    }, [pagina, limite, busqueda]);

    useEffect(() => {
        cargarPedidos();
    }, [cargarPedidos]);

    useEffect(() => {
        const cerrarConEscape = (e) => {
            if (e.key === 'Escape' && !actualizando) {
                setPedidoSeleccionado(null);
            }
        };

        window.addEventListener('keydown', cerrarConEscape);

        return () => {
            window.removeEventListener('keydown', cerrarConEscape);
        };
    }, [actualizando]);

    const formatearFecha = (fecha) => {
        const fechaPedido = new Date(fecha);

        return Number.isNaN(fechaPedido.getTime())
            ? 'Fecha no disponible'
            : fechaPedido.toLocaleString('es-AR');
    };

    const formatearPrecio = (precio) => Number(precio).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'
    });

    const verDetalle = (pedido) => {
        setPedidoSeleccionado(pedido);
        setNuevoEstado(pedido.estado);
        setError('');
        setMensajeExito('');
    };

    const cambiarEstado = async () => {
        if (
            !pedidoSeleccionado ||
            !nuevoEstado ||
            nuevoEstado === pedidoSeleccionado.estado
        ) {
            return;
        }

        setActualizando(true);
        setError('');

        try {
            await actualizarEstadoPedido(
                pedidoSeleccionado.id,
                nuevoEstado
            );

            setMensajeExito('Pedido actualizado correctamente')

            setPedidos((pedidosActuales) =>
                pedidosActuales.map((pedido) =>
                    pedido.id === pedidoSeleccionado.id
                        ? { ...pedido, estado: nuevoEstado }
                        : pedido
                )
            );

            setPedidoSeleccionado((pedidoActual) => ({
                ...pedidoActual,
                estado: nuevoEstado
            }));

        } catch (errorActualizacion) {
            console.error('Error al actualizar el estado:', errorActualizacion);

            setError(
                errorActualizacion.response?.data?.mensaje ||
                'No se pudo actualizar el estado del pedido'
            );
        } finally {
            setActualizando(false);
        }
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda('');
        setPagina(1);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setPagina(1);
    };

    return (
        <div className="flex min-h-screen bg-[#070709]">
            <AsideAdmin isOpen={isOpen} />

            <main className={`${isOpen ? 'ml-[18rem]' : 'ml-0'} flex-1 p-8 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                    <button
                        className="cursor-pointer text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Menu size={30} />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>

                <div className="my-4 border-b border-gray-600" />

                <h1 className="text-2xl text-white">Pedidos</h1>
                <h2 className="mb-4 text-lg text-gray-400">Gestiona los pedidos</h2>

                {/* busqueda */}
                <div className="relative md:col-span-5">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={handleBusquedaChange}
                        placeholder="Buscar por nombre, precio, categoría..."
                        className="w-100 rounded-xl border border-slate-500 py-2 pl-9 pr-8 text-sm text-slate-100 placeholder-slate-400 focus:border-[#B00020]/30 focus:outline-none focus:ring-1 focus:ring-[#B00020]/30 bg-transparent"
                    />
                    {busqueda && (
                        <button
                            onClick={handleLimpiarBusqueda}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                            title="Limpiar búsqueda"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {error && !pedidoSeleccionado && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg border border-red-700 bg-red-950/50 p-4 text-red-200"
                    >
                        {error}
                        <button
                            onClick={cargarPedidos}
                            className="ml-3 font-semibold underline"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                <div className="mt-8 overflow-x-auto rounded-t bg-[#1E1F24]">
                    <table className="w-full text-center text-sm text-gray-300">
                        <thead className="bg-[#B00020]/30 text-gray-100">
                            <tr>
                                <th className="p-4">Pedido</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td className="py-8 text-gray-400" colSpan="6">
                                        Cargando pedidos...
                                    </td>
                                </tr>
                            ) : pedidos.length === 0 ? (
                                <tr>
                                    <td className="py-8 text-gray-400" colSpan="6">
                                        No hay pedidos para mostrar
                                    </td>
                                </tr>
                            ) : pedidos.map((pedido) => (
                                <tr key={pedido.id} className="border-t border-gray-700 align-top">
                                    <td className="py-5">#{pedido.id}</td>

                                    <td className="px-3 py-5">
                                        <div>
                                            {[pedido.Usuario?.nombre, pedido.Usuario?.apellido]
                                                .filter(Boolean)
                                                .join(' ') || 'Cliente no disponible'}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {pedido.Usuario?.email || ''}
                                        </div>
                                    </td>

                                    <td className="px-3 py-5">
                                        {formatearFecha(pedido.fechaPedido)}
                                    </td>


                                    <td className="px-3 py-5">
                                        {formatearPrecio(pedido.total)}
                                    </td>

                                    <td className="px-3 py-5">
                                        {pedido.estado}
                                    </td>
                                    <td className="px-3 py-5">
                                        <button
                                            onClick={() => verDetalle(pedido)}
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#B00020]/50 px-3 py-2 text-white transition hover:bg-red-800"
                                        >
                                            <Eye size={16} />
                                            Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Paginación */}
                <div className="flex flex-col items-center justify-between pl-15 pr-20 pt-8 gap-3 border-slate-200 bg-slate-50/10 px-4 py-3 sm:flex-row rounded-b">
                    <div className="text-xs text-slate-400">
                        {totalPaginas > 1 && (
                            <span> (Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>)</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPagina(1)}
                            disabled={pagina === 1}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Primera página"
                        >
                            «
                        </button>

                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
                                .map((p, idx, arr) => {
                                    const prev = arr[idx - 1];
                                    const esPuntitos = prev && p - prev > 1;
                                    return (
                                        <div key={p} className="flex items-center gap-1">
                                            {esPuntitos && <span className="px-1 text-slate-400">...</span>}
                                            <button
                                                onClick={() => setPagina(p)}
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${pagina === p
                                                    ? 'bg-blue-800 text-white shadow-sm'
                                                    : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>

                        <button
                            onClick={() => setPagina(totalPaginas)}
                            disabled={pagina >= totalPaginas}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Última página"
                        >
                            »
                        </button>
                    </div>
                </div>
            </main>

            {/* Modal de detalle: conserva los estilos anteriores */}
            {pedidoSeleccionado && (


                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => {
                        if (!actualizando) {
                            setPedidoSeleccionado(null);
                        }
                    }}
                >
                    <div
                        className="w-full max-w-2xl rounded-lg border border-gray-700 bg-[#1E1F24] p-6 text-gray-200 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between border-b border-gray-700 pb-3">
                            <h2 className="text-xl font-semibold text-white">
                                Detalle del pedido #{pedidoSeleccionado.id}
                            </h2>

                            <button
                                onClick={() => setPedidoSeleccionado(null)}
                                disabled={actualizando}
                                className="cursor-pointer text-gray-400 transition hover:text-white disabled:opacity-50"
                                title="Cerrar"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-5 space-y-2 text-sm">
                            <p>
                                <span className="text-gray-400">Cliente: </span>
                                {[pedidoSeleccionado.Usuario?.nombre, pedidoSeleccionado.Usuario?.apellido]
                                    .filter(Boolean)
                                    .join(' ') || 'Cliente no disponible'}
                            </p>

                            <p>
                                <span className="text-gray-400">Correo: </span>
                                {pedidoSeleccionado.Usuario?.email || ''}
                            </p>

                            <p>
                                <span className="text-gray-400">Fecha: </span>
                                {formatearFecha(pedidoSeleccionado.fechaPedido)}
                            </p>
                        </div>

                        <h3 className="mb-3 font-semibold text-white">
                            Productos
                        </h3>

                        <div className="max-h-60 overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#070709] text-gray-300">
                                    <tr>
                                        <th className="p-3">Producto</th>
                                        <th className="p-3">Cantidad</th>
                                        <th className="p-3">Precio</th>
                                        <th className="p-3">Subtotal</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pedidoSeleccionado.detalles?.length ? (
                                        pedidoSeleccionado.detalles.map((detalle) => (
                                            <tr key={detalle.id} className="border-b border-gray-700">
                                                <td className="p-3">
                                                    {detalle.producto?.nombre || `Producto ${detalle.idProducto}`}
                                                </td>
                                                <td className="p-3">{detalle.cantidad}</td>
                                                <td className="p-3">
                                                    {formatearPrecio(detalle.precioUnitario)}
                                                </td>
                                                <td className="p-3">
                                                    {formatearPrecio(
                                                        Number(detalle.precioUnitario) * Number(detalle.cantidad)
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-4 text-center text-gray-400">
                                                Sin detalles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <p className="text-right text-lg font-semibold text-white">
                                Total: {formatearPrecio(pedidoSeleccionado.total)}
                            </p>
                        </div>

                        {/* Único agregado: cambiar el estado */}
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <label className="mb-2 block text-sm text-gray-300">
                                Estado del pedido
                            </label>

                            <select
                                value={nuevoEstado}
                                onChange={(e) => {
                                    setNuevoEstado(e.target.value);
                                    setMensajeExito('');
                                }}
                                disabled={actualizando}
                                className="w-full rounded-lg border border-gray-600 bg-[#070709] p-2 text-white"
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="enviado">Enviado</option>
                                <option value="entregado">Entregado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>

                            {error && (
                                <p role="alert" className="mt-2 text-sm text-red-400">
                                    {error}
                                </p>
                            )}

                            {mensajeExito && (
                                <p role="status" className="mt-2 text-sm text-green-400">
                                    {mensajeExito}
                                </p>
                            )}

                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={cambiarEstado}
                                    disabled={
                                        actualizando ||
                                        !nuevoEstado ||
                                        nuevoEstado === pedidoSeleccionado.estado
                                    }
                                    className="rounded-lg bg-[#B00020] px-4 py-2 text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {actualizando ? 'Actualizando...' : 'Guardar estado'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pedidos;
