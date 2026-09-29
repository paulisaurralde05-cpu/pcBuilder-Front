import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerItems, eliminarItem, buscarItems } from "../services/api.js";
import Button from "../components/button.jsx";
import FormCategory from "./FormCategory.jsx";
import AsideAdmin from "./AsideAdmin.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { Menu, Trash, Pencil, Plus, LogOut } from 'lucide-react';

function Categories() {
    const [category, setCategory] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [categorySeleccionada, setcategorySeleccionada] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [busqueda, setBusqueda] = useState('');

    const navigate = useNavigate();
    const { logout } = useContext(UserContext) || {};

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (logout) logout();
        navigate('/admin/login', { replace: true });
    };

    const cargarCategorias = useCallback(async () => {
        try {
            const params = {
                pagina,
                limite,
            };
            if (busqueda.trim() !== '') {
                params.busqueda = busqueda.trim();
            }
            const respuesta = await buscarItems('categorias', params);
            if (respuesta && respuesta.categorias) {
                setCategory(respuesta.categorias);
                setTotal(respuesta.total || 0);
                setTotalPaginas(respuesta.totalPaginas || 1);
            } else if (Array.isArray(respuesta)) {
                setCategory(respuesta);
                setTotal(respuesta.length);
                setTotalPaginas(1);
            }
        } catch (error) {
            console.error('Error al buscar categorias:', error);
        }
    }, [pagina, limite, busqueda]);

    const handleLimpiarBusqueda = () => {
        setBusqueda('');
        setPagina(1);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setPagina(1);
    };

    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);

    const createCategory = () => {
        setcategorySeleccionada(null);
        setMostrarForm(true);
    };

    const editCategory = (category) => {
        setcategorySeleccionada(category);
        setMostrarForm(true);
    };

    const deleteCategory = async (id) => {
        try {
            await eliminarItem('categorias', id);
            await cargarCategorias();
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
        }
    };

    return (
        <div className='flex bg-[#070709] min-h-screen'>
            <AsideAdmin isOpen={isOpen} />

            <div className={`${isOpen ? 'ml-[16rem]' : 'ml-0'} flex-1 p-8 transition-all duration-300`}>
                <div className='flex items-center justify-between'>
                    <button className="cursor-pointer text-white" onClick={() => setIsOpen(!isOpen)}>
                        <Menu size={30} />
                    </button>

                    <button 
                        onClick={handleLogout}
                        className='bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition cursor-pointer text-sm'
                        title="Cerrar Sesión"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>

                <div className='border-b border-gray-600 my-4'></div>

                <h1 className='text-2xl text-white'>Categorías</h1>
                <h2 className='text-lg text-gray-400 mb-4'>Gestiona tus Categorías</h2>

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
                        placeholder="Buscar por nombre, descripción..."
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

                <button className='absolute right-10 top-30 bg-blue-800 text-white font-bold py-4 px-6 rounded-lg mb-4 flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer' onClick={createCategory}>
                    <Plus size={30} />
                    <span>Crear Categoría</span>
                </button>

                {mostrarForm && (
                    <FormCategory 
                        category={categorySeleccionada} 
                        onCancelar={() => setMostrarForm(false)} 
                        onGuardar={cargarCategorias}
                    />
                )}

                <div className='mt-8 bg-[#1E1F24] rounded-t overflow-hidden'>
                    <table className='w-full text-center text-sm text-gray-300'>
                        <thead className='bg-[#B00020]/30 text-gray-100'>
                            <tr>
                                <th className='p-4'>Nombre</th>
                                <th className="text-left">Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category?.map((c) => (
                                <tr key={c.id}>
                                    <td className="py-5">{c.nombre?.slice(0, 15)}...</td>
                                    <td className="w-60 text-left">{c.descripcion}</td>
                                    <td className='mt-5 flex justify-center gap-2'>
                                        <button className='bg-blue-800 hover:bg-blue-700 p-1 rounded cursor-pointer' onClick={() => { editCategory(c); }}>
                                            <Pencil />
                                        </button>

                                        <button className='rounded p-1 bg-[#B00020]/80 hover:bg-red-600 cursor-pointer' onClick={() => { deleteCategory(c.id); }}>
                                            <Trash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
            </div>
        </div>
    );
}

export default Categories;