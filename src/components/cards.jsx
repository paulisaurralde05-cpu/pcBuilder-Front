import { useState, useEffect } from 'react';
import { obtenerItems, agregarItem } from '../services/api.js';
import { Link } from 'react-router-dom';


function Cards() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await obtenerItems('productos');
        setItems(data);
      } catch (error) {
        console.error('Error al obtener los items:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="cards">
      {items?.map((item) => (
        <div key={item.id} className="card">
          <Link to={`/productos/${item.id}`}>
            <h3>{item.nombre}</h3>
          </Link>

          <p>${Number(item.precio).toFixed()}</p>

          <button 
            className="btn-agregar" 
            onClick={() => agregarItem({ idProducto: item.id, cantidad: 1 })}
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
}

export default Cards;