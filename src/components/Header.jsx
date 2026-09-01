import '../styles/user/header.css';
function Header() {
    
  return (
    <div className="header">
        <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/nosotros">Nosotros</a></li>
            <li><a href="/carrito">Carrito</a></li>
        </ul>
    </div>
  )
}

export default Header