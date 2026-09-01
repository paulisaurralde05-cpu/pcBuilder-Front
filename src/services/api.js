import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },  
});

api.interceptors.response.use(
    (response) => {
        console.log(
            `Respuesta ${response.config.method?.toUpperCase()} ${response.config.url}:`,
            response.data
        );
        return response.data?.data ?? response.data;
    },
    (error) => {
        const message = error.response?.data?.mensaje || error.message;
        console.error('Error en la petición:', message);
        return Promise.reject(new Error(message));
    }
);


export const obtenerItems = (tipo) => api.get(`${tipo}/`);
export const obtenerItemsXid = (tipo, id) => api.get(`${tipo}/${id}`);
export const crearItem = (tipo, body) => api.post(`${tipo}/`, body);
export const actualizarItem = (tipo, id, body) => api.put(`${tipo}/${id}`, body);
export const eliminarItem = (tipo, id) => api.delete(`${tipo}/${id}`);