import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserProvider.jsx';
import { ProductProvider } from './context/ProductProvider.jsx';
import PanelAdmin from './adminPages/PanelAdmin.jsx';
import Login from './components/Login.jsx';
import LoginAdmin from "./adminPages/LoginAdmin.jsx";
import Register from './components/Register';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail.jsx';
import Categories from './adminPages/Categories.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Cart from './pages/Cart.jsx';

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <Routes>
          {/* Rutas Privadas / Admin */}
          <Route path="/admin" element={<PanelAdmin />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Rutas Públicas */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/carrito" element={<Cart />} />

          <Route path="*" element={<Login />} />
        </Routes>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;