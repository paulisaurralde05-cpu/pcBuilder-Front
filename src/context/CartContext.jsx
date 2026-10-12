import { createContext, useState, useEffect, useContext } from 'react';
import { obtenerItems } from '../services/api.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const localData = localStorage.getItem('cart_cache');
    return localData ? JSON.parse(localData) : null;
  });

  const fetchCarrito = async () => {
    try {
      const data = await obtenerItems('carrito');
      setCarrito(data);
      localStorage.setItem('cart_cache', JSON.stringify(data));
    } catch (error) {
      console.error('Error al actualizar carrito global:', error.message);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  const totalProductos = carrito?.items?.reduce((acc, item) => acc + item.cantidad, 0) || 0;

  return (
    <CartContext.Provider value={{ carrito, setCarrito, fetchCarrito, totalProductos }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);