import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },  
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        return response.data?.data !== undefined ? response.data.data : response.data;
    },
    (error) => {
        const message = error.response?.data?.mensaje || error.message;
        return Promise.reject(new Error(message));
    }
);


export const obtenerItems = (tipo) => api.get(`${tipo}/`);
export const obtenerItemsXid = (tipo, id) => api.get(`${tipo}/${id}`);
export const crearItem = (tipo, body) => api.post(`${tipo}/`, body);
export const actualizarItem = (tipo, id, body) => api.put(`${tipo}/${id}`, body);
export const eliminarItem = (tipo, id) => api.delete(`${tipo}/${id}`);