import { useEffect, useState } from 'react';
import { obtenerItems, crearItem, actualizarItem } from '../services/api.js';
import "../styles/admin/form.css"

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

    // EFECTO 1: Llenar el formulario si estamos editando y reiniciar la imagen
    useEffect(() => {
        setFormulario({
            nombre: producto?.nombre || '',
            precio: producto?.precio || '',
            descripcion: producto?.descripcion || '',
            stock: producto?.stock || '',
            especificacionesTecnicas: producto?.especificacionesTecnicas || '',
            idCategoria: producto?.idCategoria || ''
        });
        setImagen(null); // IMPORTANTE: Limpia la imagen seleccionada al cambiar de producto
    }, [producto]);

    // EFECTO 2: Traer las categorías al montar el componente
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
        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    // CORREGIDO: Extraer el archivo del array de archivos
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImagen(e.target.files[0]); // Tomamos SOLO el primer archivo
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Creamos el FormData para enviar campos de texto + archivo binario
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

            // CORREGIDO: Solo se envía UNA VEZ (con FormData)
            if (producto) {
                // Editando -> PUT
                await actualizarItem('productos', producto.id, formData);
            } else {
                // Creando -> POST
                await crearItem('productos', formData);
            }

            if (onGuardar) onGuardar();
            onCancelar();

        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{producto ? 'Editar Producto' : 'Crear Producto'}</h2>
                </div>

                <button className='modal-close' onClick={onCancelar}>X</button>

                <form onSubmit={handleSubmit} className="formulario-producto">
                    <div className='form-group'>
                        <input type="text" name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre" />
                    </div>

                    <div className="form-group">
                        <input type="number" name="precio" value={formulario.precio} onChange={handleChange} placeholder="Precio" />
                    </div>

                    <div className="form-group">
                        <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} placeholder="Descripción" />
                    </div>

                    <div className="form-group">
                        <input type="number" name="stock" value={formulario.stock} onChange={handleChange} placeholder="Stock" />
                    </div>

                    <div className="form-group">
                        <input type="text" name="especificacionesTecnicas" value={formulario.especificacionesTecnicas} onChange={handleChange} placeholder="Especificaciones Técnicas" />
                    </div>

                    <div className="form-group">
                        <select name="idCategoria" value={formulario.idCategoria} onChange={handleChange}>
                            <option value=""> Seleccionar categoría </option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo de imagen para Multer */}
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                            Imagen del producto:
                        </label>
                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className='form-actions'>
                        <button className='btn-cancelar' type="button" onClick={onCancelar}>
                            Cancelar
                        </button>
                        <button className='btn-guardar' type="submit">
                            {producto ? 'Actualizar Producto' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Form;