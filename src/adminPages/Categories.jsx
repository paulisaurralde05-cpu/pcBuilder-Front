import { useEffect, useState } from "react"
import { obtenerItems, eliminarItem } from "../services/api"
import Button from "../components/button";
import FormCategory from "./FormCategory";
import AsideAdmin from "./AsideAdmin.jsx";
import '../styles/admin/panelAdmin.css';


function Categories() {
    const [category, setCategory] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [categorySeleccionada, setcategorySeleccionada] = useState(null);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await obtenerItems('categorias');
                setCategory(data)
                console.log(data)
            } catch (error) {
                console.log('Error:', error.message)
            }
        }
        fetchCategories();
    }, [category])
    const createCategory = () => {
        setcategorySeleccionada(null)
        setMostrarForm(true)
    }
    const editCategory = (category) => {
        setcategorySeleccionada(category)
        setMostrarForm(true)
    }
    const deleteCategory = (id) => {
        eliminarItem('categorias', id)
    }
    return (
        <div className="panel-admin">
            <AsideAdmin />

            <div className='contenido-admin'>

                <h1>Categorías</h1>
                <Button className='crear' text='Crear' onClick={createCategory} />
                {mostrarForm && <FormCategory category={categorySeleccionada} onCancelar={() => setMostrarForm(false)} />}

                <div className='table-container' >
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {category?.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.nombre.slice(0, 15)}</td>
                                    <td>{c.descripcion}</td>
                                    <td className='acciones'>
                                        <Button text='🟩' onClick={() => { editCategory(c); }} />
                                        <Button text='❌' onClick={() => { deleteCategory(c.id); }} />
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

export default Categories