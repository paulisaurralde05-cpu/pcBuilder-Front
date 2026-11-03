
import { useEffect, useState } from 'react';
import { obtenerItems, crearItem, actualizarItem } from '../services/api.js';
import "../styles/admin/form.css"

// Recibe tres props desde PanelAdmin.jsx:
// - producto: Si es null, estamos creando. Si tiene datos, estamos editando.
// - onCancelar: Función para cerrar el modal.
// - onGuardar: Función para recargar la tabla después de guardar.
function Form({ producto, onCancelar, onGuardar }) {

    // Estado del formulario: Un solo objeto para manejar todos los inputs.
    // Arranca vacío por defecto.
    const [formulario, setFormulario] = useState({

        nombre: '',
        precio: '',
        descripcion: '',
        stock: '',
        especificacionesTecnicas: '',
        idCategoria: ''
    });

    // Guarda la lista de categorías que traemos de la base de datos para el <select>.
    const [categorias, setCategorias] = useState([]);

    // EFECTO 1 Si nos pasan un 'producto' (o sea, estamos editando),
    // llenamos el formulario con sus datos. Si es null, se queda vacío.
    useEffect(() => {
        setFormulario({
            nombre: producto?.nombre || '',
            precio: producto?.precio || '',
            descripcion: producto?.descripcion || '',
            stock: producto?.stock || '',
            especificacionesTecnicas: producto?.especificacionesTecnicas || '',
            idCategoria: producto?.idCategoria || ''
        });
    }, [producto]); // Se vuelve a ejecutar si el producto cambia.

    // EFECTO 2 Se ejecuta UNA SOLA VEZ al abrir el formulario.
    // Pide las categorías a la API para poder llenar el desplegable (select).
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
    }, []); // El array vacío significa "solo al montar el componente".

    // Maneja lo que el usuario escribe en CUALQUIER input.
    const handleChange = (e) => {
        const { name, value } = e.target;
        // [name] es una "propiedad computada".
        // Permite usar el valor de la variable 'name' como el nombre de la propiedad.
        // Así evitamos hacer un handleChange para cada input.

        setFormulario({
            ...formulario, // Copiamos todo lo que ya estaba escrito.
            [name]: value // Sobrescribimos solo el campo que se modificó.
        });
    };

    const handleSubmit = async (e) => {
        // Evita que la página se recargue cuando apretás "Guardar".
        e.preventDefault();

        try {
            // Convertimos los strings a números donde corresponde, porque el input
            // type="number" devuelve strings.
            const datos = {
                ...formulario,
                precio: Number(formulario.precio),
                stock: Number(formulario.stock),
                idCategoria: Number(formulario.idCategoria)
            };

            // Si hay 'producto', significa que estamos editando -> Hacemos PUT.
            if (producto) {
                await actualizarItem('productos', producto.id, datos);
            } else {
                // Si no hay producto, estamos creando -> Hacemos POST.
                await crearItem('productos', datos);
            }

            // Si todo sale bien, recargamos la tabla en el PanelAdmin y cerramos el modal.
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
                    {/* Operador ternario para cambiar el título según el modo */}
                    <h2>{producto ? 'Editar Producto' : 'Crear Producto'}</h2>
                </div>

                <button className='modal-close' onClick={onCancelar}>X</button>

                <form onSubmit={handleSubmit} className="formulario-producto">
                    {/* Acá van los inputs. Todos están "controlados" por React 
                        porque tienen value={formulario.x} y onChange={handleChange} */}

                    <div className='form-group'>
                        <input
                            type="text"
                            name="nombre" // 'name' DEBE coincidir con la propiedad del estado.
                            value={formulario.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                        />
                    </div>
                    {/* ... (precio, descripcion, stock, especificaciones) ... */}

                    <div className="form-group">
                        <input
                            type="number"
                            name="precio"
                            value={formulario.precio}
                            onChange={handleChange}
                            placeholder="Precio"
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            name="descripcion"
                            value={formulario.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="number"
                            name="stock"
                            value={formulario.stock}
                            onChange={handleChange}
                            placeholder="Stock"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="especificacionesTecnicas"
                            value={formulario.especificacionesTecnicas}
                            onChange={handleChange}
                            placeholder="Especificaciones Técnicas"
                        />
                    </div>

                    <div className="form-group">
                        <select
                            name="idCategoria"
                            value={formulario.idCategoria}
                            onChange={handleChange}
                        >
                            <option value=""> Seleccionar categoría </option>
                            {/* Recorremos el estado de categorías para generar un <option> por cada una */}

                            {categorias.map((categoria) => (
                                <option
                                    key={categoria.id}
                                    value={categoria.id}
                                >
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
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