import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { obtenerItems } from '../services/api.js';
import { UserContext } from './UserContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useContext(UserContext) || {};
  const userRole = (user?.role || user?.rol || '').toLowerCase();
  const esClienteAutenticado = Boolean(token && user && userRole !== 'admin');

  const [carrito, setCarrito] = useState(() => {
    if (!esClienteAutenticado) return null;

    const localData = localStorage.getItem('cart_cache');
    return localData ? JSON.parse(localData) : null;
  });

  const cargarCarrito = useCallback(async () => {
    const data = await obtenerItems('carrito');
    localStorage.setItem('cart_cache', JSON.stringify(data));
    return data;
  }, []);

  const fetchCarrito = useCallback(async () => {
    if (!esClienteAutenticado) return;

    try {
      setCarrito(await cargarCarrito());
    } catch (error) {
      console.error('Error al actualizar carrito global:', error.message);
    }
  }, [cargarCarrito, esClienteAutenticado]);

  useEffect(() => {
    if (!esClienteAutenticado) return;

    let activo = true;
    const cargar = async () => {
      try {
        const data = await cargarCarrito();
        if (activo) setCarrito(data);
      } catch (error) {
        console.error('Error al actualizar carrito global:', error.message);
      }
    };

    cargar();
    return () => {
      activo = false;
    };
  }, [cargarCarrito, esClienteAutenticado]);

  const totalProductos = carrito?.items?.reduce((acc, item) => acc + item.cantidad, 0) || 0;

  return (
    <CartContext.Provider value={{ carrito, setCarrito, fetchCarrito, totalProductos }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);