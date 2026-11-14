import axios from 'axios'; 
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/'; 

export const api = axios.create({ 
    baseURL: API_URL, 
    headers: { 
        'Content-Type': 'application/json', 
    }, 
}); 

// Interceptor para adjuntar el token JWT en cada petición 
api.interceptors.request.use( 
    (config) => { 
        const token = localStorage.getItem('token'); 
        if (token) { 
            config.headers.Authorization = `Bearer ${token}`; 
        } 
        return config; 
    }, (error) => Promise.reject(error) 
); 

// Interceptor para simplificar la respuesta y formatear errores 
api.interceptors.response.use( 
    (response) => { 
        return response.data?.data !== undefined ? response.data.data : response.data; 
    }, 
    (error) => { 
        const message = error.response?.data?.mensaje || error.message; 
        return Promise.reject(new Error(message)); 
    } 
); 

export const obtenerItems = (tipo, query) => api.get(`${tipo}/`, { params: query }); 
export const obtenerItemsXid = (tipo, id) => api.get(`${tipo}/${id}`); 
export const crearItem = (tipo, body) => api.post(`${tipo}/`, body); 
export const actualizarItem = (tipo, id, body) => api.put(`${tipo}/${id}`, body); 
export const eliminarItem = (tipo, id) => api.delete(`${tipo}/${id}`); 
export const buscarItems = (tipo, query) => api.get(`${tipo}/buscar`, { params: query }); 

// Multer 
export const crearProductoConImagen = (formData) => api.post('productos/', formData, { 
    headers: { 'Content-Type': 'multipart/form-data' }, 
}); 

export const actualizarProductoConImagen = (id, formData) => api.put(`productos/${id}`, formData, { 
    headers: { 'Content-Type': 'multipart/form-data' }, 
}); 

// Carrito 
export const obtenerCarrito = () => api.get('carrito/'); 
export const agregarItem = (body) => api.post('carrito/agregar', body);
export const agregarAlCarrito = (idProducto, cantidad = 1) => api.post('carrito/agregar', { idProducto, cantidad }); 
export const eliminarDelCarrito = (idProducto) => api.delete(`carrito/eliminar/${idProducto}`); 

// Pedidos
export const confirmarPedido = () => api.post('pedidos/crear'); 
export const actualizarEstadoPedido = (id, estado) => api.patch(`admin/pedidos/${id}/estado`, { estado });