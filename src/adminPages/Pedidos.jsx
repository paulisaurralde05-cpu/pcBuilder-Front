
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
        <div className="flex min-h-screen bg-slate-950 text-slate-300">
            <AsideAdmin isOpen={isOpen} />

            <main className={`${isOpen ? 'ml-[18rem]' : 'ml-0'} flex-1 p-8 transition-all duration-300`}>

                {/* BARRA SUPERIOR */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        className="cursor-pointer text-slate-300 hover:text-white transition-colors bg-slate-900 p-2 rounded-lg border border-slate-800 shadow-sm"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Menu size={24} />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-slate-900 border border-slate-800 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition cursor-pointer text-sm shadow-sm"
                        title="Cerrar Sesión"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>

                <div className="border-b border-slate-800 my-4" />

                <h1 className="text-2xl text-white font-bold">Pedidos</h1>
                <h2 className="text-sm text-slate-400 mb-6">Gestiona los pedidos</h2>

                {/* BUSCADOR (Alineado igual que en Categorías) */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full sm:w-80">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            placeholder="Buscar por cliente, estado..."
                            className="w-full rounded-lg border border-slate-700 py-2 pl-9 pr-8 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-900 shadow-sm"
                        />
                        {busqueda && (
                            <button
                                onClick={handleLimpiarBusqueda}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                                title="Limpiar búsqueda"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {error && !pedidoSeleccionado && (
                    <div role="alert" className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
                        {error}
                        <button onClick={cargarPedidos} className="ml-3 font-semibold underline">
                            Reintentar
                        </button>
                    </div>
                )}

                {/* TABLA DE PEDIDOS (Bordes y Cabecera idénticos a Categorías) */}
                <div className="mt-4 bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-slate-300">
                        <thead className="bg-slate-950 text-slate-100 uppercase text-xs tracking-wider font-bold border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left">Pedido</th>
                                <th className="px-6 py-4 text-left">Cliente</th>
                                <th className="px-6 py-4 text-left">Fecha</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-center">Detalle</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/50">
                            {cargando ? (
                                <tr>
                                    <td className="py-8 text-slate-500 text-center" colSpan="6">Cargando pedidos...</td>
                                </tr>
                            ) : pedidos.length === 0 ? (
                                <tr>
                                    <td className="py-8 text-slate-500 text-center" colSpan="6">No hay pedidos para mostrar</td>
                                </tr>
                            ) : pedidos.map((pedido) => (
                                <tr key={pedido.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">#{pedido.id}</td>

                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">
                                            {[pedido.Usuario?.nombre, pedido.Usuario?.apellido].filter(Boolean).join(' ') || 'Cliente no disponible'}
                                        </div>
                                        <div className="text-xs text-slate-500">{pedido.Usuario?.email || ''}</div>
                                    </td>

                                    <td className="px-6 py-4 text-slate-400">{formatearFecha(pedido.fechaPedido)}</td>
                                    <td className="px-6 py-4 text-right font-medium text-emerald-400">{formatearPrecio(pedido.total)}</td>

                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pedido.estado.toLowerCase() === 'pendiente' ? 'bg-amber-400/10 text-amber-400' :
                                            pedido.estado.toLowerCase() === 'enviado' ? 'bg-blue-400/10 text-blue-400' :
                                                pedido.estado.toLowerCase() === 'entregado' ? 'bg-emerald-400/10 text-emerald-400' :
                                                    'bg-red-400/10 text-red-400'
                                            }`}>
                                            {pedido.estado}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => verDetalle(pedido)}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-500 shadow-sm"
                                        >
                                            <Eye size={14} /> Ver detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN */}
                <div className="flex flex-col items-center justify-between pt-6 gap-3 sm:flex-row">
                    <div className="text-xs text-slate-500">
                        {totalPaginas > 1 && (
                            <span>Mostrando página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong></span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPagina(1)} disabled={pagina === 1} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50">«</button>
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
                            .map((p, idx, arr) => {
                                const prev = arr[idx - 1];
                                const esPuntitos = prev && p - prev > 1;
                                return (
                                    <div key={p} className="flex items-center gap-1">
                                        {esPuntitos && <span className="px-1 text-slate-500">...</span>}
                                        <button
                                            onClick={() => setPagina(p)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${pagina === p ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    </div>
                                );
                            })}
                        <button onClick={() => setPagina(totalPaginas)} disabled={pagina >= totalPaginas} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50">»</button>
                    </div>
                </div>
            </main>

            {/* MODAL DE DETALLE */}
            {pedidoSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={() => { if (!actualizando) setPedidoSeleccionado(null); }}>
                    <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>

                        <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-xl font-bold text-white">Detalle del pedido #{pedidoSeleccionado.id}</h2>
                            <button onClick={() => setPedidoSeleccionado(null)} disabled={actualizando} className="text-slate-400 hover:text-white transition disabled:opacity-50 text-xl font-bold">
                                ✕
                            </button>
                        </div>

                        <div className="mb-5 space-y-2 text-sm text-slate-300">
                            <p><span className="text-slate-500">Cliente: </span>{pedidoSeleccionado.Usuario?.nombre} {pedidoSeleccionado.Usuario?.apellido}</p>
                            <p><span className="text-slate-500">Correo: </span>{pedidoSeleccionado.Usuario?.email || ''}</p>
                            <p><span className="text-slate-500">Fecha: </span>{formatearFecha(pedidoSeleccionado.fechaPedido)}</p>
                        </div>

                        <h3 className="mb-3 font-semibold text-white">Productos</h3>
                        <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-800">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950 text-slate-100 uppercase text-xs tracking-wider font-bold">
                                    <tr>
                                        <th className="p-3">Producto</th>
                                        <th className="p-3 text-center">Cantidad</th>
                                        <th className="p-3 text-right">Precio</th>
                                        <th className="p-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {pedidoSeleccionado.detalles?.length ? (
                                        pedidoSeleccionado.detalles.map((detalle) => (
                                            <tr key={detalle.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="p-3 text-white">{detalle.producto?.nombre || `Producto ${detalle.idProducto}`}</td>
                                                <td className="p-3 text-center">{detalle.cantidad}</td>
                                                <td className="p-3 text-right text-slate-400">{formatearPrecio(detalle.precioUnitario)}</td>
                                                <td className="p-3 text-right font-medium text-emerald-400">{formatearPrecio(Number(detalle.precioUnitario) * Number(detalle.cantidad))}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="p-4 text-center text-slate-500">Sin detalles</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 border-t border-slate-800 pt-4">
                            <p className="text-right text-lg font-bold text-white">Total: <span className="text-emerald-400">{formatearPrecio(pedidoSeleccionado.total)}</span></p>
                        </div>

                        <div className="mt-4 border-t border-slate-800 pt-4">
                            <label className="mb-2 block text-sm text-slate-400">Estado del pedido</label>
                            <select
                                value={nuevoEstado}
                                onChange={(e) => { setNuevoEstado(e.target.value); setMensajeExito(''); }}
                                disabled={actualizando}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="enviado">Enviado</option>
                                <option value="entregado">Entregado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>

                            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                            {mensajeExito && <p className="mt-2 text-sm text-emerald-400">{mensajeExito}</p>}

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={cambiarEstado}
                                    disabled={actualizando || !nuevoEstado || nuevoEstado === pedidoSeleccionado.estado}
                                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 shadow-sm cursor-pointer"
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
