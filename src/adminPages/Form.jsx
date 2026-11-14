import { useEffect, useState } from 'react';
import { obtenerItems, crearItem, actualizarItem } from '../services/api.js';
// Ya no necesitamos importar form.css porque usaremos Tailwind

function Form({ producto, onCancelar, onGuardar }) {

    const [formulario, setFormulario] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        stock: '',
        especificacionesTecnicas: '',
        idCategoria: ''
    });

    const [imagen, setImagen] = useState(null);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        setFormulario({
            nombre: producto?.nombre || '',
            precio: producto?.precio || '',
            descripcion: producto?.descripcion || '',
            stock: producto?.stock || '',
            especificacionesTecnicas: producto?.especificacionesTecnicas || '',
            idCategoria: producto?.idCategoria || ''
        });
        setImagen(null);
    }, [producto]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await obtenerItems('categorias');
                setCategorias(data);
            } catch (error) {
                console.error('Error al obtener categorías:', error);
            }
        };
        fetchCategorias();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagen(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('nombre', formulario.nombre);
            formData.append('precio', formulario.precio);
            formData.append('descripcion', formulario.descripcion);
            formData.append('stock', formulario.stock);
            formData.append('especificacionesTecnicas', formulario.especificacionesTecnicas);
            formData.append('idCategoria', formulario.idCategoria);

            if (imagen) {
                formData.append('imagen', imagen);
            }

            if (producto) {
                await actualizarItem('productos', producto.id, formData);
            } else {
                await crearItem('productos', formData);
            }

            if (onGuardar) onGuardar();
            onCancelar();

        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    // 👇 ACÁ EMPIEZA EL DISEÑO OSCURO CON TAILWIND 👇
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">

            {/* max-h-[90vh] y overflow-y-auto para que scrollee si la pantalla es chica */}
            <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">

                <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className="text-xl font-bold text-white">
                        {producto ? 'Editar Producto' : 'Crear Producto'}
                    </h2>
                    <button
                        onClick={onCancelar}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xl font-bold"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Nombre */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-300">Nombre del Producto</label>
                        <input
                            type="text" name="nombre" value={formulario.nombre} onChange={handleChange} required
                            placeholder="Ej: Procesador AMD Ryzen 5"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Precio y Stock (en la misma fila) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Precio ($)</label>
                            <input
                                type="number" name="precio" value={formulario.precio} onChange={handleChange} required
                                placeholder="0.00"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Stock</label>
                            <input
                                type="number" name="stock" value={formulario.stock} onChange={handleChange} required
                                placeholder="0"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-300">Categoría</label>
                        <select
                            name="idCategoria" value={formulario.idCategoria} onChange={handleChange} required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="">Seleccionar categoría...</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-300">Descripción</label>
                        <textarea
                            name="descripcion" value={formulario.descripcion} onChange={handleChange} required
                            placeholder="Describe las características principales..."
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-y"
                        />
                    </div>

                    {/* Especificaciones Técnicas */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-300">Especificaciones Técnicas</label>
                        <input
                            type="text" name="especificacionesTecnicas" value={formulario.especificacionesTecnicas} onChange={handleChange}
                            placeholder="Ej: 6 núcleos, 12 hilos, 3.7GHz"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Imagen */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-300">Imagen del producto</label>
                        <input
                            type="file" name="imagen" accept="image/*" onChange={handleFileChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer focus:outline-none"
                        />
                        <span className="text-xs text-slate-500 mt-1">Dejalo vacío si no querés cambiar la imagen (al editar).</span>
                    </div>

                    {/* Botones */}
                    <div className="mt-4 flex justify-end gap-3 border-t border-slate-800 pt-4">
                        <button
                            type="button" onClick={onCancelar}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 shadow-md shadow-blue-900/50 cursor-pointer"
                        >
                            {producto ? 'Actualizar Producto' : 'Crear Producto'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Form;