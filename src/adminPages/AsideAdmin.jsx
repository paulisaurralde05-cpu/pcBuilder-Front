import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/admin/panelAdmin.css';
function AsideAdmin() {
    return (
        <div>
            <aside className='sidebar'>
                <h2>Pc Builder</h2>
                <nav>
                    <Link to="/admin">Productos</Link> <br />
                    <Link to="">Pedidos</Link>
                    <Link to="/admin/categories">Categorias</Link>
                </nav>
            </aside>
        </div>
    )
}

export default AsideAdmin