import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserProvider';
import { ProductProvider } from './context/ProductProvider';
import PanelAdmin from './adminPages/PanelAdmin.jsx';
import Login from './components/login';
import Register from './components/Register';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail.jsx';
import Categories from './adminPages/categories.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Cart from './pages/Cart.jsx';

function App() {
  return (
    < UserProvider >
      <ProductProvider>
          <Routes>
            {/* Rutas Privadas */}
            <Route path="/admin" element={<PanelAdmin />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* Rutas Públicas */}
            <Route path="/home" element={<Home />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="*" element={<Login />} />
          </Routes>
      </ProductProvider>
    </UserProvider >
  );

}

export default App;