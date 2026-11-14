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
                navigate('/login');
            }, 1200);

        } catch (err) {
            console.error('Error en registro:', err);
            setError(err.response?.data?.mensaje || err.message || 'Error al registrarse');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 bg-white border border-slate-200 rounded-xl text-slate-800 shadow-lg">
                <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Crear Cuenta</h1>
                
                {error && (
                    <p className="text-white font-semibold text-center text-sm mb-4 bg-red-700 p-2.5 rounded-lg">
                        {error}
                    </p>
                )}
                {mensaje && (
                    <p className="text-white font-semibold text-center text-sm mb-4 bg-emerald-600 p-2.5 rounded-lg">
                        {mensaje}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Nombre:</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formulario.nombre} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-green-600 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Apellido:</label>
                        <input 
                            type="text" 
                            name="apellido" 
                            value={formulario.apellido} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-green-600 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formulario.email} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-green-600 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Contraseña:</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formulario.password} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-green-600 transition"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition mt-2 cursor-pointer"
                    >
                        Registrarse
                    </button>
                </form>

                <p className="text-center mt-6 text-xs text-slate-600">
                    ¿Ya tenés una cuenta?{' '}
                    <Link to="/login" className="text-green-700 font-semibold hover:underline">
                        Iniciá sesión acá
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;