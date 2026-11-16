import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { eliminarItem, buscarItems } from "../services/api.js";
import FormCategory from "./FormCategory.jsx";
import AsideAdmin from "./AsideAdmin.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { Menu, Trash, Pencil, Plus, LogOut, AlertCircle } from "lucide-react";

function Categories() {
    const [category, setCategory] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [categorySeleccionada, setCategorySeleccionada] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Estado del input (se actualiza en cada tecla)
    const [busqueda, setBusqueda] = useState("");
    // Solo se actualiza después de la última tecla
    const [busquedaDebounced, setBusquedaDebounced] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { logout } = useContext(UserContext) || {};

    // Limpia token y redirige al login
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (logout) logout();
        navigate("/admin/login", { replace: true });
    };

    // Cada vez que cambia 'busqueda' esperamos unos segundos
    // Si el usuario sigue escribiendo, se cancela el timer anterior.
    // Cuando pasan 300ms sin escribir, se actualiza 'busquedaDebounced'.
    useEffect(() => {
        const timer = setTimeout(() => {
            setBusquedaDebounced(busqueda);
            setPagina(1); // resetear a página 1 al cambiar la búsqueda
        }, 300);

        return () => clearTimeout(timer); // cancelar timer anterior
    }, [busqueda]);

    // Depende de 'busquedaDebounced'
    const cargarCategorias = useCallback(async () => {
        try {
            setError(""); // limpiar error previo en cada intento

            const params = { pagina, limite };

            if (busquedaDebounced.trim() !== "") {
                params.busqueda = busquedaDebounced.trim();
            }

            const respuesta = await buscarItems("categorias", params);

            if (respuesta && respuesta.categorias) {
                setCategory(respuesta.categorias);
                setTotal(respuesta.total || 0);
                setTotalPaginas(respuesta.totalPaginas || 1);
            } else if (Array.isArray(respuesta)) {
                setCategory(respuesta);
                setTotal(respuesta.length);
                setTotalPaginas(1);
            } else {
                setCategory([]);
                setTotal(0);
                setTotalPaginas(1);
            }
        } catch (err) {
            console.error("Error al buscar categorias:", err);
            setError(err.message || "Error al cargar las categorías");
            setCategory([]);
            setTotal(0);
            setTotalPaginas(1);
        }
    }, [pagina, limite, busquedaDebounced]);

    // Cada vez que cambia 'cargarCategorias', se ejecuta
    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);

    // Resetea el input Y el debounced inmediatamente
    const handleLimpiarBusqueda = () => {
        setBusqueda("");
        setBusquedaDebounced("");
        setPagina(1);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    // Abre el formulario en modo Crear
    const createCategory = () => {
        setCategorySeleccionada(null);
        setMostrarForm(true);
    };

    // Abre el formulario en modo Editar
    const editCategory = (cat) => {
        setCategorySeleccionada(cat);
        setMostrarForm(true);
    };

    // Elimina una categoría con confirmación y manejo de errores.
    // Si era el último ítem de la página actual y no estamos en la 1,
    // volvemos a la página anterior para no quedar en una página vacía.
    const deleteCategory = async (id, nombre) => {
        const confirmado = window.confirm(
            `¿Eliminar la categoría "${nombre}"?.`,
        );
        if (!confirmado) return;

        try {
            setError("");
            await eliminarItem("categorias", id);

            if (category.length === 1 && pagina > 1) {
                // Era el único de esta página, entonces retrocedemos
                setPagina(pagina - 1);
            } else {
                await cargarCategorias();
            }
        } catch (err) {
            console.error("Error al eliminar categoría:", err);
            setError(err.message || "No se pudo eliminar la categoría");
        }
    };

    // Contadores
    const inicio = total === 0 ? 0 : (pagina - 1) * limite + 1;
    const fin = Math.min(pagina * limite, total);

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-300">
            <AsideAdmin isOpen={isOpen} />

            <div
                className={`${isOpen ? "ml-[18rem]" : "ml-0"} flex-1 p-8 transition-all duration-300`}
            >
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
                <h2 className="text-sm text-slate-400 mb-6">
                    Gestiona tus Categorías
                </h2>

                {/* BUSCADOR Y BOTÓN CREAR */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full sm:w-80">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
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
                            <button
                                onClick={handleLimpiarBusqueda}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white cursor-pointer"
                                title="Limpiar búsqueda"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
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

                {/* BANNER DE ERROR */}
                {error && (
                    <div
                        role="alert"
                        className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    >
                        <div className="flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={cargarCategorias}
                            className="font-semibold underline hover:no-underline cursor-pointer"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {mostrarForm && (
                    <FormCategory
                        category={categorySeleccionada}
                        onCancelar={() => setMostrarForm(false)}
                        onGuardar={cargarCategorias}
                    />
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
                            {category.length === 0 ? (
                                // Mensaje cuando no hay filas
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-12 text-center text-slate-500"
                                    >
                                        {error
                                            ? "No se pudieron cargar las categorías."
                                            : busquedaDebounced
                                              ? `No se encontraron categorías para "${busquedaDebounced}".`
                                              : "Todavía no hay categorías. Creá la primera con el botón de arriba."}
                                    </td>
                                </tr>
                            ) : (
                                category.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-3 font-medium text-white">
                                            {c.nombre}
                                        </td>
                                        <td className="px-6 py-3 text-slate-400">
                                            {c.descripcion}
                                        </td>
                                        <td className="px-6 py-3 flex justify-center gap-2">
                                            <button
                                                className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors cursor-pointer"
                                                onClick={() => editCategory(c)}
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                                                onClick={() =>
                                                    deleteCategory(c.id, c.nombre)
                                                }
                                                title="Eliminar"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN */}
                <div className="flex flex-col items-center justify-between pt-6 gap-3 sm:flex-row">
                    <div className="text-xs text-slate-500">
                        {total > 0 && (
                            <span>
                                Mostrando {inicio}-{fin} de{" "}
                                <strong>{total}</strong>{" "}
                                {total === 1 ? "categoría" : "categorías"}
                                {totalPaginas > 1 && (
                                    <>
                                        {" · "}
                                        Página <strong>{pagina}</strong> de{" "}
                                        <strong>{totalPaginas}</strong>
                                    </>
                                )}
                            </span>
                        )}
                    </div>
                    {totalPaginas > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPagina(1)}
                                disabled={pagina === 1}
                                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                title="Primera página"
                            >
                                «
                            </button>
                            {Array.from(
                                { length: totalPaginas },
                                (_, i) => i + 1,
                            )
                                .filter(
                                    (p) =>
                                        p === 1 ||
                                        p === totalPaginas ||
                                        Math.abs(p - pagina) <= 1,
                                )
                                .map((p, idx, arr) => {
                                    const prev = arr[idx - 1];
                                    const esPuntitos = prev && p - prev > 1;
                                    return (
                                        <div
                                            key={p}
                                            className="flex items-center gap-1"
                                        >
                                            {esPuntitos && (
                                                <span className="px-1 text-slate-500">
                                                    ...
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setPagina(p)}
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                                                    pagina === p
                                                        ? "bg-blue-600 text-white shadow-sm"
                                                        : "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        </div>
                                    );
                                })}
                            <button
                                onClick={() => setPagina(totalPaginas)}
                                disabled={pagina >= totalPaginas}
                                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                title="Última página"
                            >
                                »
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Categories;