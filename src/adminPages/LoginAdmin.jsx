import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/authService.js';
import { UserContext } from '../context/UserContext.jsx';

export const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginAdmin(email, password);

            if (data && data.token) {
                login(data.usuario || data.cliente, data.token);
                navigate('/admin');
            } else {
                setError('No se recibió el token de autorización');
            }
        } catch (err) {
            console.error('Error en login admin:', err);
            setError(err.response?.data?.mensaje || err.message || 'Error al iniciar sesión como admin');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 bg-white border border-slate-200 rounded-xl text-slate-800 shadow-lg">
                <h1 className="text-2xl font-bold text-center text-slate-700 mb-6">Acceso Administrador</h1>
                
                {error && (
                    <p className="text-white font-semibold text-center text-sm mb-4 bg-red-700 p-2.5 rounded-lg">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="admin-email" className="block text-xs font-medium text-slate-700 mb-1.5">Email de Admin:</label>
                        <input 
                            id="admin-email"
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-green-600 transition"
                        />
                    </div>

                    <div>
                        <label htmlFor="admin-password" className="block text-xs font-medium text-slate-700 mb-1.5">Contraseña:</label>
                        <input 
                            id="admin-password"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-green-600 transition"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition mt-2 cursor-pointer"
                    >
                        Ingresar al Panel
                    </button>
                </form>
            </div>
            
        </div>
    );
};

export default LoginAdmin;