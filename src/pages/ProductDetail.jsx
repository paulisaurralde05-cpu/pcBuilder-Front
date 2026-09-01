import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { obtenerItemsXid } from '../services/api.js';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await obtenerItemsXid('productos', id);
        setProduct(data);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div>
      <Header />
      <h1>Detalle del Producto</h1>
      {product && (
        <div>
          <h1>{product.nombre}</h1>
          <p>Descripción: {product.descripcion}</p>
          <p>Precio: ${Number(product.precio).toFixed(2)}</p>
          <p>Stock: {product.stock}</p>
        </div>
      )}
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}

export default ProductDetail