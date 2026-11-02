import { useState } from 'react';
import { UserContext } from './UserContext';

// trae las funciones de API desde authService.js
import { 
  solicitarRecuperacion as solicitarRecuperacionService, 
  restablecerPassword as restablecerPasswordService 
} from '../services/authService';

// exporta el UserProvider (recibe la prop children)
export const UserProvider = ({ children }) => {

  // estado user para ver si hay usuario en el localStorage (lo parsea, lo pasa de JSOn a objeto).
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // busca el token JWT en el localStorage.
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // la función para iniciar sesión: actualiza los estados de user y token con los datos del servidor. Los guardo en el localStorage.
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // la función que cierra la sesión: resetea los estados en null y borra los datos del localStorage.
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // la función que pide el mail de recuperación.
  const solicitarRecuperacion = async (email) => {
    try {

      // llama a axios, si la api responde bien devuelve el objeto de exito.
      const data = await solicitarRecuperacionService(email);
      return { exito: true, mensaje: data.mensaje };
    } catch (error) {

      // si da error, devuelve el objeto con false y el mensaje.
      return { 
        exito: false, 
        mensaje: error.response?.data?.mensaje || 'Error al solicitar el código' 
      };
    }
  };

  // función async que valida el código y guarda la nueva contraseña. Recibe el objeto datos que tiene el mail, el codigo y la nueva conttraseña.
  const restablecerPassword = async (datos) => {
    try {

      // envia los datos a axios, si la respuesta que da el back es exitosa devuelve el objeto de exito.
      const data = await restablecerPasswordService(datos);
      return { exito: true, mensaje: data.mensaje };
    } catch (error) {

      // si da error, devuelve el objeto con false y el mensaje.
      return { 
        exito: false, 
        mensaje: error.response?.data?.mensaje || 'El código es inválido o expiro' 
      };
    }
  };

  // devuelve el componente, y se pasa en value los estados y las funciones para que estén disponibles.
  return (
    <UserContext.Provider value={{ user, token, login, logout, solicitarRecuperacion, restablecerPassword }}>
      {children}
    </UserContext.Provider>
  );
};