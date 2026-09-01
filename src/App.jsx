import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import PanelAdmin from './adminPages/PanelAdmin.jsx';
import Categories from './adminPages/categories.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Nosotros from './pages/Nosotros.jsx';

function App() {


  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/productos/:id" element={<ProductDetail />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/nosotros" element={<Nosotros />} />


      {/* Rutas Privadas */}
      <Route path="/admin" element={<PanelAdmin />} />
      <Route path="/admin/categories" element={<Categories />} />
    </Routes>
  )
}

export default App
