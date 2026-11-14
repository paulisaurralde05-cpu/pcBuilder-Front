import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { eliminarItem, obtenerItems, buscarItems } from "../services/api.js";
import Form from "./Form.jsx";
import AsideAdmin from "./AsideAdmin.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { getImagenUrl } from "../utils/helpers.js";
import { Menu, Trash, Pencil, Plus, LogOut, Star } from "lucide-react";

function PanelAdmin() {
  const [productos, setProductos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useContext(UserContext) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (logout) logout();
    navigate("/admin/login", { replace: true });
  };

  const cargarProductos = useCallback(async () => {
    try {
      const params = {
        pagina,
        limite,
      };
      if (busqueda.trim() !== "") {
        params.busqueda = busqueda.trim();
      }
      const respuesta = await buscarItems("productos", params);
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
      console.error("Error al buscar productos:", error);
    }
  }, [pagina, limite, busqueda]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

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
      await eliminarItem("productos", id);
      await cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };
  //Función para activar/desactivar el PRODUCTODESTACADO
  const toggleDestacado = async (producto) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/productos/${producto.id}/destacar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !producto.featured }),
      });

      await cargarProductos();
    } catch (error) {
      console.error("Error al destacar:", error);
    }
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda("");
    setPagina(1);
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPagina(1);
  };

  const inicioRegistro = total === 0 ? 0 : (pagina - 1) * limite + 1;
  const finRegistro = Math.min(pagina * limite, total);

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

        <h1 className="text-2xl text-white font-bold">Productos</h1>
        <h2 className="text-sm text-slate-400 mb-6">Gestiona tus productos</h2>

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
              placeholder="Buscar productos..."
              className="w-full rounded-lg border border-slate-700 py-2 pl-9 pr-8 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-900 shadow-sm"
            />
            {busqueda && (
              <button
                onClick={handleLimpiarBusqueda}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
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
            onClick={createProducto}
          >
            <Plus size={18} />
            <span>Crear Producto</span>
          </button>
        </div>

        {mostrarForm && (
          <Form
            producto={productoSeleccionado}
            onCancelar={() => setMostrarForm(false)}
            onGuardar={cargarProductos}
          />
        )}

        {/* TABLA DE PRODUCTOS */}
        <div className="mt-4 bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-slate-300">
            {/* Cabecera oscura que combina con el resto del panel */}
            <thead className="bg-slate-950 text-slate-100 uppercase text-xs tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-center">Imagen</th>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-right">Precio($)</th>
                <th className="px-6 py-4 text-right">Stock</th>
                <th className="px-6 py-4 text-left">Categoría</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {productos?.map((producto) => (
                <tr key={producto.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-6 flex justify-center">
                    <img
                      src={getImagenUrl(producto.imagenes?.[0]?.url)}
                      alt={producto.nombre}
                      className="w-10 h-10 object-cover rounded-md border border-slate-700 bg-slate-800"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://ui-avatars.com/api/?name=PC&background=1e293b&color=94a3b8";
                      }}
                    />
                  </td>
                  <td className="px-6 py-3 font-medium text-white">
                    {producto.nombre?.slice(0, 20)}...
                  </td>
                  <td className="px-6 py-3 text-right">
                    ${Number(producto.precio).toFixed(0)}
                  </td>
                  <td className="px-6 py-3 text-right">{producto.stock}</td>
                  <td className="px-6 py-3 text-slate-400">{producto.categoria?.nombre}</td>

                  <td className="px-6 py-3 flex justify-center gap-2">
                    {/* BOTONES DE ACCIÓN ESTILO GHOST (Se iluminan al pasar el mouse) */}
                    <button
                      onClick={() => toggleDestacado(producto)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${producto.featured
                        ? "text-amber-400 bg-amber-400/10"
                        : "text-slate-500 hover:text-amber-400 hover:bg-amber-400/10"
                        }`}
                      title="Destacar"
                    >
                      <Star size={18} fill={producto.featured ? "currentColor" : "none"} />
                    </button>

                    <button
                      className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors cursor-pointer"
                      onClick={() => editProduto(producto)}
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deleteProducto(producto.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                      title="Eliminar"
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
              <span>
                Mostrando página <strong>{pagina}</strong> de{" "}
                <strong>{totalPaginas}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPagina(1)}
              disabled={pagina === 1}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              title="Primera página"
            >
              «
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1,
                )
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const esPuntitos = prev && p - prev > 1;
                  return (
                    <div key={p} className="flex items-center gap-1">
                      {esPuntitos && (
                        <span className="px-1 text-slate-500">...</span>
                      )}
                      <button
                        onClick={() => setPagina(p)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${pagina === p
                          ? "bg-blue-600 text-white shadow-sm"
                          : "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
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
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
