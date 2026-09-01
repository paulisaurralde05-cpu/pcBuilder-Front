import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginCliente } from '../services/authService.js';
import { UserContext } from '../context/UserContext.jsx';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginCliente(email, password);

            if (data && (data.token || data.cliente)) {
                login(data.cliente, data.token);
                navigate('/home');
            } else {
                setError('No se recibió el token de autenticación');
            }
        } catch (err) {
            console.error('Error detallado:', err);
            setError(err.response?.data?.mensaje || err.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="max-w-md mx-auto my-16 p-6 bg-neutral-900 border border-neutral-800 rounded-xl text-slate-100 shadow-lg">
            <h1 className="text-2xl font-bold text-center text-white mb-6">Iniciar Sesión</h1>
            
            {error && (
                <p className="text-red-500 font-semibold text-center text-sm mb-4 bg-red-950/50 p-2 rounded border border-red-800">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">Email:</label>
                    <input 
                        id="email"
                        name="email"
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1.5">Contraseña:</label>
                    <input 
                        id="password"
                        name="password"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition mt-2 cursor-pointer"
                >
                    Ingresar
                </button>
            </form>

            <p className="text-center mt-6 text-xs text-neutral-400">
                ¿No tenés una cuenta?{' '}
                <Link to="/registro" className="text-red-500 font-semibold hover:underline">
                    Registrate acá
                </Link>
            </p>
        </div>
    );
};

export default Login;