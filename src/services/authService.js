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

export const loginAdmin = async (email, password) => {
    const response = await axios.post(`${API_URL}/admin/login`, { email, password });
    return response.data;
};

// exporta la funcion para pedir el código de recuperación de contraseña (6 dígitos).
export const solicitarRecuperacion = async (email) => {
    
    // envía la solicitud pasando el email en el body para que el back busque el usuario y le envie el mail.
    const response = await axios.post(`${API_URL}/solicitar-recuperacion`, { email });

    // devuelve la rta del back.
    return response.data;
};

// exporta la función para restablecer la contraseña, recibe el objeto datos que tiene el mail, el codigo y la nueva contraseña.
export const restablecerPassword = async (datos) => {

    // hace la petición mandando el codigo de 6 dígitos y la nueva clave  para que se actualice en la bd.
    const response = await axios.post(`${API_URL}/restablecer-password`, datos);

    // devuelve la confirmación del back.
    return response.data;
};