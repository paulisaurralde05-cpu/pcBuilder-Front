import { useState, useEffect } from "react";
import { ProductContext } from "./ProductContext";
import { obtenerItems } from "../services/api.js";

export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const [productosResp, categoriasResp] = await Promise.all([
          obtenerItems("productos"),
          obtenerItems("categorias"),
        ]);

        if (!mounted) return;

        if (Array.isArray(productosResp)) {
          setProductos(productosResp);
        } else if (Array.isArray(productosResp?.productos)) {
          setProductos(productosResp.productos);
        } else {
          setProductos([]);
        }

        if (Array.isArray(categoriasResp)) {
          setCategorias(categoriasResp);
        } else if (Array.isArray(categoriasResp?.categorias)) {
          setCategorias(categoriasResp.categorias);
        } else {
          setCategorias([]);
        }
      } catch (err) {
        console.error("Error al cargar productos/categorías:", err);
        if (mounted) {
          setError(err.message || "Error al cargar los datos");
          setProductos([]);
          setCategorias([]);
        }
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
    <ProductContext.Provider value={{ productos, categorias, cargando, error }}>
      {children}
    </ProductContext.Provider>
  );
};
