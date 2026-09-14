import { useState } from 'react'
import { NavLink } from 'react-router-dom'
function AsideAdmin({isOpen}) {
    const linkClass = ({ isActive }) =>
        isActive
            ? "bg-[#B00020]/30 p-2 rounded-md text-white"
            : "text-white p-2 rounded-md hover:bg-[#B00020]/50 transition-all duration-300";

    return (
        <div>
            <aside className={`fixed top-0 left-0 min-w-[16rem] h-screen bg-[#1E1F24] text-white p-4 ${isOpen ? 'block' : 'hidden'}`}>
                <h2 className='text-2xl font-bold mt-6 mb-10'> Panel Admin</h2>
                <nav className='flex flex-col gap-10 text-lg'>
                    <NavLink to="/admin/panel" className={linkClass} >
                        Productos
                    </NavLink>
                    {/* <NavLink to="">Pedidos</NavLink> */}
                    <NavLink to="/admin/categories" className={linkClass} >
                        Categorias
                    </NavLink>
                </nav>
            </aside>
        </div>
    )
}

export default AsideAdmin