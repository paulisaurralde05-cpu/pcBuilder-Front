import React, { useEffect, useState } from 'react'
import { crearItem, actualizarItem, } from '../services/api.js'

function FormCategory({ category, onCancelar, onGuardar }) {

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
            if (onGuardar) onGuardar();

            onCancelar();

        } catch (error) {
            alert('Error al guardar categoría:', error);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

                <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className="text-xl font-bold text-white">
                        {category ? 'Editar Categoría' : 'Crear Categoría'}
                    </h2>
                    <button
                        onClick={onCancelar}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-300">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formulario.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Placas de Video"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-300">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formulario.descripcion}
                            onChange={handleChange}
                            placeholder="Describe brevemente la categoría..."
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-y"
                        />
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancelar}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 shadow-md shadow-blue-900/50 cursor-pointer"
                        >
                            {category ? 'Actualizar Categoría' : 'Crear Categoría'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormCategory