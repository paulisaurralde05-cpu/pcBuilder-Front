import { useEffect, useState } from 'react'
import { eliminarItem, obtenerItems } from '../services/api.js';
import Button from '../components/button.jsx';
import Form from './Form.jsx';
import AsideAdmin from './AsideAdmin.jsx';
import '../styles/admin/panelAdmin.css';


function PanelAdmin() {
    const [productos, setProductos] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const fetchProductos = async () => {
        try {
            const data = await obtenerItems('productos');
            setProductos(data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    useEffect(() => {
        let isMounted = true;

        obtenerItems('productos')
            .then((data) => {
                if (isMounted) setProductos(data);
            })
            .catch((error) => console.error('Error al obtener los productos:', error));

        return () => {
            isMounted = false;
        };
    }, []);

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
            await eliminarItem('productos', id);
            await fetchProductos();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    return (
        <div className='panel-admin'>

            <AsideAdmin />

            <div className='contenido-admin'>
                <h1>Panel de Administración</h1>
                <Button className='crear' text='Crear' onClick={createProducto} />

                {mostrarForm && (
                    <Form
                        producto={productoSeleccionado}
                        onCancelar={() => setMostrarForm(false)}
                        onGuardar={fetchProductos}
                    />
                )}

                <div className='table-container'>
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
                                        <Button text='🟩' onClick={() => editProduto(producto)} />
                                        <Button text='❌' onClick={() => deleteProducto(producto.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PanelAdmin;