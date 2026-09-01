import { useState, useEffect } from 'react';
import { ProductContext } from './ProductContext';

export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let mounted = true;

    const cargar = async () => {
      setCargando(true);
      try {
        const response = await fetch('http://localhost:3000/productos');
        const data = await response.json();

        if (mounted) {
          if (Array.isArray(data)) {
            setProductos(data);
          } else if (Array.isArray(data.productos)) {
            setProductos(data.productos);
          } else if (Array.isArray(data.data)) {
            setProductos(data.data);
          } else {
            setProductos([]);
          }
        }
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        if (mounted) setCargando(false);
      }
    };

    cargar();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ProductContext.Provider value={{ productos, cargando }}>
      {children}
    </ProductContext.Provider>
  );
};