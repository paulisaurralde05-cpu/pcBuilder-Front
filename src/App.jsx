import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserProvider } from './context/UserProvider.jsx';
import { ProductProvider } from './context/ProductProvider.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AdminProtegido from './components/AdminProtegido.jsx'; 
import PanelAdmin from './adminPages/PanelAdmin.jsx';
import LoginAdmin from "./adminPages/LoginAdmin.jsx";
import Categories from './adminPages/Categories.jsx';
import Pedidos from './adminPages/Pedidos.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Cart from './pages/Cart.jsx';

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <Routes>
          {/* Ruta de Login para Admin - Pública */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Rutas Privadas - Protegidas de Admin*/}
          <Route element={<AdminProtegido />}>
            <Route path="/admin" element={<PanelAdmin />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/pedidos" element={<Pedidos />} />
          </Route>

          {/* El carrito solo se comparte con las páginas de clientes. */}
          <Route element={<CartProvider><Outlet /></CartProvider>}>
            <Route path="/home" element={<Home />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/carrito" element={<Cart />} />
          </Route>

          {/* Rutas Públicas */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Login />} />
        </Routes>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;