import { NavLink } from 'react-router-dom'

function AsideAdmin({ isOpen }) {
    const linkClass = ({ isActive }) =>
        isActive
            ? "bg-blue-600/10 text-blue-400 font-semibold p-3 rounded-lg transition-colors border-l-2 border-blue-500"
            : "text-slate-400 hover:bg-slate-900 hover:text-white p-3 rounded-lg transition-colors border-l-2 border-transparent";

    return (
        <div>
            <aside className={`fixed top-0 left-0 min-w-[16rem] h-screen bg-slate-950 border-r border-slate-800 p-5 z-10 shadow-xl ${isOpen ? 'block' : 'hidden'}`}>

                {/* ENCABEZADO*/}
                <div className='mt-2 mb-4 flex flex-col gap-1'>
                    <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-1.5 rounded-md text-xs font-bold shadow-lg shadow-blue-500/30">
                            PB
                        </span>
                        <span className="text-lg font-bold text-white tracking-tight">
                            Panel Admin
                        </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase ml-1">
                        Gestión de Tienda
                    </span>
                </div>

                {/* Divisor */}
                <div className="border-b border-slate-800 mb-4"></div>

                {/* MENÚ DE NAVEGACIÓN */}
                <nav className='flex flex-col gap-1 text-sm'>
                    <NavLink to="/admin" className={linkClass} end >Productos</NavLink>
                    <NavLink to="/admin/categories" className={linkClass} >Categorias</NavLink>
                    <NavLink to="/admin/pedidos" className={linkClass}>Pedidos</NavLink>
                </nav>
            </aside>
        </div>
    )
}

export default AsideAdmin