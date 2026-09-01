import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000/auth';

export const loginCliente = async (email, password) => {
    const response = await axios.post(`${API_URL}/cliente/login`, { email, password });
    return response.data;
};

export const registrarCliente = async (datos) => {
    const response = await axios.post(`${API_URL}/cliente/registro`, datos);
    return response.data;
};