import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarCliente } from '../services/authService.js';
import { UserContext } from '../context/UserContext.jsx';

export const Register = () => {
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        try {
            const respuesta = await registrarCliente(formulario);
            const resData = respuesta.data || respuesta;

            if (resData && (resData.token || resData.cliente)) {
                if (login) {
                    login(resData.cliente, resData.token);
                } else {
                    localStorage.setItem('token', resData.token);
                    localStorage.setItem('usuario', JSON.stringify(resData.cliente));
                }
            }

            setMensaje('Registro realizado con éxito.');
            
            setTimeout(() => {
                navigate('/home');
            }, 1200);

        } catch (err) {
            console.error('Error en registro:', err);
            setError(err.response?.data?.mensaje || err.message || 'Error al registrarse');
        }
    };

    return (
        <div className="max-w-md mx-auto my-16 p-6 bg-neutral-900 border border-neutral-800 rounded-xl text-slate-100 shadow-lg">
            <h1 className="text-2xl font-bold text-center text-white mb-6">Crear Cuenta</h1>
            
            {error && (
                <p className="text-red-500 font-semibold text-center text-sm mb-4 bg-red-950/50 p-2 rounded border border-red-800">
                    {error}
                </p>
            )}
            {mensaje && (
                <p className="text-emerald-400 font-semibold text-center text-sm mb-4 bg-emerald-950/50 p-2 rounded border border-emerald-800">
                    {mensaje}
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Nombre:</label>
                    <input 
                        type="text" 
                        name="nombre" 
                        value={formulario.nombre} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Apellido:</label>
                    <input 
                        type="text" 
                        name="apellido" 
                        value={formulario.apellido} 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formulario.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Contraseña:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formulario.password} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition mt-2 cursor-pointer"
                >
                    Registrarse
                </button>
            </form>

            <p className="text-center mt-6 text-xs text-neutral-400">
                ¿Ya tenés una cuenta?{' '}
                <Link to="/login" className="text-red-500 font-semibold hover:underline">
                    Iniciá sesión acá
                </Link>
            </p>
        </div>
    );
};

export default Register;