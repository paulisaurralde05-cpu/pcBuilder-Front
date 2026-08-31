import React, { useEffect, useState } from 'react'
import {crearItem, actualizarItem, } from '../services/api.js'
function FormCategory({ category, onCancelar }) {

    const [formulario, setFormulario] = useState({
        nombre: '',
        descripcion: ''
    })

    useEffect(() => {
        setFormulario({
            nombre: category?.nombre || '',
            descripcion: category?.descripcion || ''
        });

    }, [category]);

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
            };

            if (category) {
                await actualizarItem('categorias', category.id, datos);
            } else {
                await crearItem('categorias', datos);
            }

            onCancelar();

        } catch (error) {
            console.error('Error al guardar categoría:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{category ? 'Editar Categoría' : 'Crear Categoría'}</h2>
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
                        <textarea
                            name="descripcion"
                            value={formulario.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción"
                        />
                    </div>

                    <div className='form-actions'>
                        <button className='btn-cancelar' type="button" onClick={onCancelar}>
                            Cancelar
                        </button>

                        <button className='btn-guardar' type="submit">
                            {category ? 'Actualizar Categoría' : 'Crear Categoría'}
                        </button>

                    </div>


                </form>

            </div>
        </div>
    );
}

export default FormCategory