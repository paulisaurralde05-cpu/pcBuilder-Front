import { useState } from 'react';
import { UserContext } from './UserContext';
import { 
  solicitarRecuperacion as solicitarRecuperacionService, 
  restablecerPassword as restablecerPasswordService 
} from '../services/authService';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const solicitarRecuperacion = async (email) => {
    try {
      const data = await solicitarRecuperacionService(email);
      return { exito: true, mensaje: data.mensaje };
    } catch (error) {
      return { 
        exito: false, 
        mensaje: error.response?.data?.mensaje || 'Error al solicitar el código' 
      };
    }
  };

  const restablecerPassword = async (datos) => {
    try {
      const data = await restablecerPasswordService(datos);
      return { exito: true, mensaje: data.mensaje };
    } catch (error) {
      return { 
        exito: false, 
        mensaje: error.response?.data?.mensaje || 'El código es inválido o expiro' 
      };
    }
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, solicitarRecuperacion, restablecerPassword }}>
      {children}
    </UserContext.Provider>
  );
};