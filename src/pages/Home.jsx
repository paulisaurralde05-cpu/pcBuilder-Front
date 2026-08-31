import { useState, useEffect } from 'react';
import { obtenerItems } from '../services/api.js';

const Home = () => {
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
        <div>
            <h1>Home</h1>
            <ul>
                {items?.map((item) => (
                    <li key={item.id}>nombre: {item.nombre}</li>
                ))}
            </ul>
        </div>
    );
};

export default Home;