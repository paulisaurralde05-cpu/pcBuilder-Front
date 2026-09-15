import { useEffect, useState, useCallback } from "react"
import { obtenerItems, eliminarItem, buscarItems } from "../services/api.js"
import Button from "../components/button.jsx";
import FormCategory from "./FormCategory.jsx";
import AsideAdmin from "./AsideAdmin.jsx";
import { Menu, Trash, Pencil, Plus } from 'lucide-react'


function Categories() {
    const [category, setCategory] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(null);
    const [categorySeleccionada, setcategorySeleccionada] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [pagina, setPagina] = useState(1)
    const [limite, setLimite] = useState(5)
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);


    const cargarCategorias = useCallback(async () => {
        try {
            const params = {
                pagina,
                limite,
            }
            // if (busqueda.trim() !== '') {
            //     params.busqueda = busqueda.trim();
            // }
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
    }, [pagina, limite]);

    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const data = await obtenerItems('categorias');
    //             setCategory(data)
    //             console.log(data)
    //         } catch (error) {
    //             console.log('Error:', error.message)
    //         }
    //     }
    //     fetchCategories();
    // }, [])
    const createCategory = () => {
        setcategorySeleccionada(null)
        setMostrarForm(true)
    }
    const editCategory = (category) => {
        setcategorySeleccionada(category)
        setMostrarForm(true)
    }
    const deleteCategory = (id) => {
        eliminarItem('categorias', id)
    }
    return (
        <div className='flex bg-[#070709] min-h-screen'>
            <AsideAdmin isOpen={isOpen} />

            <div className={`${isOpen ? 'ml-[16rem]' : 'ml-0'} flex-1 p-8 transition-all duration-300`}>
                <button className="cursor-pointer text-white" onClick={() => setIsOpen(!isOpen)}>
                    <Menu size={30} />
                </button>

                <div className='border-b border-gray-600 my-4'></div>

                <h1 className='text-2xl text-white mb-3'>Categorías</h1>
                <h2 className='text-lg text-gray-300 mb-20'>Gestiona tus Categorías</h2>
                <button className='absolute right-10 top-30 bg-blue-800 text-white font-bold py-4 px-6 rounded-lg mb-4 flex items-center gap-2 hover:bg-blue-700 transition' onClick={createCategory}>
                    <Plus size={30} />
                    <span>Crear Categoría</span>
                </button>

                {mostrarForm && <FormCategory category={categorySeleccionada} onCancelar={() => setMostrarForm(false)} />}

                <div className=' mt-8 bg-[#1E1F24] rounded-t overflow-hidden'>
                    <table className='w-full text-center text-sm text-gray-300 '>
                        <thead className='bg-[#B00020]/30  text-gray-100'>
                            <tr>
                                <th className='p-4'>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category?.map((c) => (
                                <tr key={c.id}>
                                    <td className="py-5 px-5">{c.nombre.slice(0, 15)}</td>
                                    <td>{c.descripcion}</td>
                                    <td className='mt-5 flex justify-center gap-2'>
                                        <button className='bg-blue-800 hover:bg-blue-700 p-1 rounded' onClick={() => { editCategory(c) }}>
                                            <Pencil />
                                        </button>

                                        <button className=' rounded p-1 bg-[#B00020]/80 hover:bg-red-600 ' onClick={() => { deleteCategory(c.id); }}>
                                            <Trash />
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
    )
}

export default Categories