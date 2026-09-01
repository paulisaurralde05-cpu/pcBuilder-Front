import { useState } from 'react';
import { crearItem, actualizarItem } from '../services/api.js';
import "../styles/admin/form.css";

function Form({ producto, onCancelar, onGuardar }) {
    const [formulario, setFormulario] = useState({
        nombre: producto?.nombre || '',
        precio: producto?.precio || '',
        descripcion: producto?.descripcion || '',
        stock: producto?.stock || '',
        especificacionesTecnicas: producto?.especificacionesTecnicas || '',
        categoria: producto?.categoria || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const datos = {
                ...formulario,
                precio: Number(formulario.precio),
                stock: Number(formulario.stock)
            };

            if (producto) {
                await actualizarItem('productos', producto.id, datos);
            } else {
                await crearItem('productos', datos);
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
                        <input
                            type="text"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
                        />
                    </div>

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
                        <input
                            type="text"
                            name="categoria"
                            value={formulario.categoria}
                            onChange={handleChange}
                            placeholder="Categoría"
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