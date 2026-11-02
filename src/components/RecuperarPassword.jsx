import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function RecuperarPassword() {
  const { solicitarRecuperacion, restablecerPassword } = useContext(UserContext);

  const [paso, setPaso] = useState(1); 
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  // enviar solicitud de código mediante el UserContext
  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    const respuesta = await solicitarRecuperacion(email);

    if (respuesta.exito) {
      setMensaje({ tipo: 'exito', texto: respuesta.mensaje });
      setPaso(2); 
    } else {
      setMensaje({ tipo: 'error', texto: respuesta.mensaje });
    }
    setCargando(false);
  };

  // restablecer la contraseña mediante el UserContext
  const handleRestablecer = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    const respuesta = await restablecerPassword({ email, codigo, nuevaPassword });

    if (respuesta.exito) {
      setMensaje({ tipo: 'exito', texto: '¡Contraseña actualizada! Redirigiendo al login...' });
      setTimeout(() => navigate('/login'), 2500);
    } else {
      setMensaje({ tipo: 'error', texto: respuesta.mensaje });
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
          {paso === 1 ? '¿Olvidaste tu contraseña?' : 'Ingresar código de seguridad'}
        </h2>
        <p className="text-slate-500 text-sm text-center mb-6">
          {paso === 1 
            ? 'Ingresá tu email registrado y te enviaremos un código de recuperación.' 
            : `Revisá la bandeja de entrada de ${email} e ingresá el código recibido.`}
        </p>

        {mensaje.texto && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium text-center ${
            mensaje.tipo === 'exito' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* pedir email */}
        {paso === 1 && (
          <form onSubmit={handleSolicitarCodigo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#00873e] hover:bg-[#006e32] text-white font-semibold py-2.5 rounded-lg transition duration-200"
            >
              {cargando ? 'Enviando...' : 'Enviar código por email'}
            </button>
          </form>
        )}

        {/* validar código y cambiar clave */}
        {paso === 2 && (
          <form onSubmit={handleRestablecer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código de 6 dígitos</label>
              <input
                type="text"
                required
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-center tracking-widest text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
              <input
                type="password"
                required
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
            >
              {cargando ? 'Actualizando...' : 'Restablecer contraseña'}
            </button>
            <button
              type="button"
              onClick={() => {
                setPaso(1);
                setMensaje({ tipo: '', texto: '' });
              }}
              className="w-full text-sm text-slate-500 hover:text-slate-700 text-center block mt-2"
            >
              ← Volver a ingresar email
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  );
}