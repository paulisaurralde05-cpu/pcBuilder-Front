import { useEffect, useState, useCallback } from 'react'
import { eliminarItem, obtenerItems, buscarItems } from '../services/api.js';
import Button from '../components/button.jsx';
import Form from './Form.jsx';
import AsideAdmin from './AsideAdmin.jsx';
import { Menu, Trash, Pencil, Plus } from 'lucide-react'

function PanelAdmin() {
    const [productos, setProductos] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    console.log(productos)
    // BUSCAR PRODUCTOS Y PAGINACIÓN
    const [busqueda, setBusqueda] = useState('');
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    // ABRIR Y CERRAR ASIDE
    const [isOpen, setIsOpen] = useState(true);

    const cargarProductos = useCallback(async () => {
        try {
            const params = {
                pagina,
                limite,
            }
            if (busqueda.trim() !== '') {
                params.busqueda = busqueda.trim();
            }
            const respuesta = await buscarItems('productos', params);
            if (respuesta && respuesta.productos) {
                setProductos(respuesta.productos);
                setTotal(respuesta.total || 0);
                setTotalPaginas(respuesta.totalPaginas || 1);
            } else if (Array.isArray(respuesta)) {
                setProductos(respuesta);
                setTotal(respuesta.length);
                setTotalPaginas(1);
            }

        } catch (error) {
            console.error('Error al buscar productos:', error);
        }
    }, [pagina, limite, busqueda]);

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    // useEffect(() => {
    //     let isMounted = true;

    //     obtenerItems('productos')
    //         .then((data) => {
    //             if (isMounted) setProductos(data);
    //         })
    //         .catch((error) => console.error('Error al obtener los productos:', error));

    //     return () => {
    //         isMounted = false;
    //     };
    // }, []);

    const createProducto = () => {
        setMostrarForm(true);
        setProductoSeleccionado(null);
    };

    const editProduto = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarForm(true);
    };

    const deleteProducto = async (id) => {
        try {
            await eliminarItem('productos', id);
            await fetchProductos();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda('');
        setPagina(1);
    }
    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setPagina(1);

    }
    const inicioRegistro = total === 0 ? 0 : (pagina - 1) * limite + 1;
    const finRegistro = Math.min(pagina * limite, total);

    return (
        <div className='flex bg-[#070709] min-h-screen'>
            <AsideAdmin isOpen={isOpen} />


            <div className={`${isOpen ? 'ml-[16rem]' : 'ml-0'} flex-1 p-8 transition-all duration-300`}>
                <button className='cursor-pointer text-white' onClick={() => setIsOpen(!isOpen)}>
                    <Menu size={30} />
                </button>
                <div className='border-b border-gray-600 my-4'></div>

                <h1 className='text-2xl text-white'>Productos</h1>
                <h2 className='text-lg text-gray-400 mb-4'>Gestiona tus productos</h2>
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
                        className="w-100 rounded-xl border border-slate-500 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:border-[#B00020]/30 focus:outline-none focus:ring-1 focus:ring-[#B00020]/30"
                    />
                    {busqueda && (
                        <button
                            onClick={handleLimpiarBusqueda}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                            title="Limpiar búsqueda"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <button className='absolute right-10 top-30 bg-blue-800 text-white font-bold py-4 px-6 rounded-lg mb-4 flex items-center gap-2 hover:bg-blue-700 transition' onClick={createProducto}>
                    <Plus size={30}/> 
                    <span>Crear Producto</span>
                </button>

                {mostrarForm && (
                    <Form
                        producto={productoSeleccionado}
                        onCancelar={() => setMostrarForm(false)}
                    // onGuardar={fetchProductos}
                    />
                )}
                {/* TABLA DE PRODUCTOS */}
                <div className=' mt-8 bg-[#1E1F24] rounded-t overflow-hidden'>
                    <table className='w-full text-center text-sm text-gray-300 '>
                        <thead className='bg-[#B00020]/30  text-gray-100'>
                            <tr>
                                <th className='p-4'>Nombre</th>
                                <th >Precio($)</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody >
                            {productos?.map((producto) => (
                                <tr key={producto.id}>
                                    <td  className="py-5" >{producto.nombre.slice(0, 15)}...</td>
                                    <td className='text-right  '> {Number(producto.precio).toFixed(0)}</td>
                                    <td className='pl-20'>{producto.stock}</td>
                                    <td>{producto.categoria?.nombre}</td>
                                    <td className='mt-5 flex justify-center gap-2'>
                                        <button className='bg-blue-800 hover:bg-blue-700 p-1 rounded' onClick={() => editProduto(producto)}>
                                            <Pencil/>
                                        </button>
                                        <button onClick={()=> deleteProducto(producto.id)} className=' rounded p-1 bg-[#B00020]/80 hover:bg-red-600 '>
                                            <Trash/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col items-center justify-between pl-15 pr-20 pt-8 gap-3 border-slate-200 bg-slate-50/10 px-4 py-3 sm:flex-row rounded-b">
                    {/* Información de registros */}
                    <div className="text-xs text-slate-500">
                        {totalPaginas > 1 && (
                            <span> (Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>)</span>
                        )}
                    </div>

                    {/* Botones de navegación */}
                    <div className="flex items-center gap-1">
                        {/* Botón Primera Página */}
                        <button
                            onClick={() => setPagina(1)}
                            disabled={pagina === 1}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Primera página"
                        >
                            «
                        </button>

                        {/* Números de página */}
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
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${pagina === p
                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Botón Última Página */}
                        <button
                            onClick={() => setPagina(totalPaginas)}
                            disabled={pagina >= totalPaginas}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Última página"
                        >
                            »
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PanelAdmin;