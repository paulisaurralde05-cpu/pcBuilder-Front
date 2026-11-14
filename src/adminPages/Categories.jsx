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

    // Función para cerrar sesión: limpia el token y te manda al login.
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (logout) logout();
        navigate('/admin/login', { replace: true });
    };

    // useCallback memoriza la función para que no se recree en cada renderizado.
    // Solo se va a volver a crear si cambian 'pagina', 'limite' o 'busqueda'.
    const cargarCategorias = useCallback(async () => {
        try {
            const params = {
                pagina,
                limite,
            };

            // Si el usuario escribió algo en el buscador, lo agregamos a los parámetros.
            if (busqueda.trim() !== '') {
                params.busqueda = busqueda.trim();
            }

            // Llamamos a la API. Como estamos en el controlador de categorías, buscamos 'categorias'.
            const respuesta = await buscarItems('categorias', params);

            // Adaptamos la respuesta según cómo devuelva los datos el backend.
            if (respuesta && respuesta.categorias) {
                setCategory(respuesta.categorias);
                setTotal(respuesta.total || 0);
                setTotalPaginas(respuesta.totalPaginas || 1);
            } else if (Array.isArray(respuesta)) {

                // Fallback por si el backend devuelve un array directo.
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

    // Cada vez que cambia 'cargarCategorias' (porque cambió la página o la búsqueda), se ejecuta.
    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);

    // Abre el formulario en modo "Crear" (sin datos iniciales).
    const createCategory = () => {
        setcategorySeleccionada(null);
        setMostrarForm(true);
    };

    // Abre el formulario en modo "Editar" pasándole la categoría seleccionada.
    const editCategory = (category) => {
        setcategorySeleccionada(category);
        setMostrarForm(true);
    };

    // Elimina una categoría y recarga la lista para que desaparezca de la tabla.
    const deleteCategory = async (id) => {
        try {
            await eliminarItem('categorias', id);
            await cargarCategorias();
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
        }
    };

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-300">
            <AsideAdmin isOpen={isOpen} />

            <div className={`${isOpen ? 'ml-[18rem]' : 'ml-0'} flex-1 p-8 transition-all duration-300`}>

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

                <div className="border-b border-slate-800 my-4"></div>

                <h1 className="text-2xl text-white font-bold">Categorías</h1>
                <h2 className="text-sm text-slate-400 mb-6">Gestiona tus Categorías</h2>

                {/* BUSCADOR Y BOTÓN CREAR */}
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
                            placeholder="Buscar por nombre o descripción..."
                            className="w-full rounded-lg border border-slate-700 py-2 pl-9 pr-8 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-900 shadow-sm"
                        />
                        {busqueda && (
                            <button onClick={handleLimpiarBusqueda} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white" title="Limpiar búsqueda">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <button
                        className="w-full sm:w-auto bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition cursor-pointer shadow-md shadow-blue-900/50"
                        onClick={createCategory}
                    >
                        <Plus size={18} />
                        <span>Crear Categoría</span>
                    </button>
                </div>

                {mostrarForm && (
                    <FormCategory category={categorySeleccionada} onCancelar={() => setMostrarForm(false)} onGuardar={cargarCategorias} />
                )}

                {/* TABLA */}
                <div className="mt-4 bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-slate-300">
                        <thead className="bg-slate-950 text-slate-100 uppercase text-xs tracking-wider font-bold border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left">Nombre</th>
                                <th className="px-6 py-4 text-left">Descripción</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {category?.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-white">{c.nombre}</td>
                                    <td className="px-6 py-3 text-slate-400">{c.descripcion}</td>
                                    <td className="px-6 py-3 flex justify-center gap-2">
                                        <button
                                            className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors cursor-pointer"
                                            onClick={() => editCategory(c)}
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                                            onClick={() => deleteCategory(c.id)}
                                        >
                                            <Trash size={18} />
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
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${pagina === p ? "bg-blue-600 text-white shadow-sm" : "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
                                        >
                                            {p}
                                        </button>
                                    </div>
                                );
                            })}
                        <button onClick={() => setPagina(totalPaginas)} disabled={pagina >= totalPaginas} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50">»</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categories;