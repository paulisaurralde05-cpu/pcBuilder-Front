import { useState } from 'react'
import { NavLink } from 'react-router-dom'

// Este componente recibe una prop llamada 'isOpen' desde el PanelAdmin.
// Sirve para saber si la barra está abierta o cerrada.
function AsideAdmin({ isOpen }) {

    // NavLink nos pasa automáticamente un objeto con la propiedad 'isActive'.
    // 'isActive' es true si la URL actual coincide con la ruta del enlace.
    const linkClass = ({ isActive }) =>
        isActive
            // Si está activo (estamos en esa página), se pone con fondo rojizo.
            ? "bg-[#B00020]/30 p-2 rounded-md text-white"
            // Si no está activo, es blanco, y al pasar el mouse (hover) se pone rojo.
            : "text-white p-2 rounded-md hover:bg-[#B00020]/50 transition-all duration-300";

    return (
        <div>
            {/* 
                'aside' es la etiqueta semántica de HTML5 para barras laterales. 
                Usamos template literals (`${}`) para aplicar clases condicionales:
                Si 'isOpen' es true, usamos 'block'. Si es false, 'hidden' (se oculta).
            */}
            <aside className={`fixed top-0 left-0 min-w-[16rem] h-screen bg-[#1E1F24] text-white p-4 ${isOpen ? 'block' : 'hidden'}`}>
                <h2 className='text-2xl font-bold mt-6 mb-10'> Panel Admin</h2>

                {/* 'nav' es la etiqueta semántica para menús de navegación */}
                <nav className='flex flex-col gap-10 text-lg'>

                    {/* 
                        'end' en el NavLink significa que solo se active si la URL es EXACTAMENTE "/admin".
                        Si no ponemos 'end', también se activaría si estamos en "/admin/productos", lo cual no queremos.
                    */}
                    <NavLink to="/admin" className={linkClass} end >
                        Productos
                    </NavLink>
                    <NavLink to="/admin/categories" className={linkClass} >
                        Categorias
                    </NavLink>
                    <NavLink to="/admin/pedidos" className={linkClass}>
                        Pedidos
                    </NavLink>
                </nav>
            </aside>
        </div>
    )
}

export default AsideAdmin