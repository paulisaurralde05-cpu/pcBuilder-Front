import React, { useEffect, useState } from 'react'
import { eliminarItem, obtenerItems } from '../services/api.js';
import Button from '../components/button.jsx';
import '../styles/admin/panelAdmin.css';
import Form from './Form.jsx';
function PanelAdmin() {
    const [productos, setProductos] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await obtenerItems('productos');
                setProductos(data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        }
        fetchProductos();
    }, [productos]);
    const createProducto = () => {
        setMostrarForm(true);
        setProductoSeleccionado(null);
    }
    const editProduto = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarForm(true);
    }
    const deleteProducto = (id) => {
        eliminarItem('productos', id);
    }

    return (
        <div className='panel-admin'>

            <aside className='sidebar'>
                <h2>Pc Builder</h2>
                <nav>
                    <button>Productos</button> <br />
                    <button>Pedidos</button>
                    <button>Categorias</button>
                </nav>
            </aside>

            <div className='contenido-admin'>
                <h1>Panel de Administración</h1>
                <Button className='crear' text='Crear' onClick={createProducto} />

                {mostrarForm && <Form producto={productoSeleccionado} onCancelar={() => setMostrarForm(false)} />}

                <div className='table-container' >
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos?.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.nombre.slice(0, 15)}...</td>
                                    <td>$ {Number(producto.precio).toFixed(0)}</td>
                                    <td>{producto.stock}</td>
                                    <td>{producto.categoria?.nombre}</td>
                                    <td className='acciones'>
                                        <Button text='🟩' onClick={() => { editProduto(producto); }} />
                                        <Button text='❌' onClick={() => { deleteProducto(producto.id); }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PanelAdmin