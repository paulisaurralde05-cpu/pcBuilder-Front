import { useState, useEffect } from 'react';
import { obtenerItems } from '../services/api.js';
import { Link } from 'react-router-dom';
import img2 from '../assets/products/img2.jpg';
import '../styles/user/cards.css';
function Cards() {
  const [items, setItems] = useState([]);
  const images = [img2];

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
          <img src={images[0]} alt={item.nombre} className="card-image" />
          <h3>{item.nombre}</h3>
          <p>${Number(item.precio).toFixed()}</p>
          <Link to={`/productos/${item.id}`} className="btn-ver">
            Ver más
          </Link>
          <button className="btn-agregar">Agregar al carrito</button>

        </div>
      ))}
    </div>
  )
}

export default Cards