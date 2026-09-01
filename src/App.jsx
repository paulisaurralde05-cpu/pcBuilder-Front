import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserProvider';
import { ProductProvider } from './context/ProductProvider';
import Login from './components/login';
import Register from './components/Register';
import Home from './pages/Home';

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register/>} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;