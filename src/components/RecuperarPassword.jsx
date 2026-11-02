import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function RecuperarPassword() {

  // extrae las dos funciones del user context que necesitamos
  const { solicitarRecuperacion, restablecerPassword } = useContext(UserContext);

  // estado para controlar en que pantalla está el usuario (1 es para ingresar el email, 2 es para ingresar código y nueva clave).
  const [paso, setPaso] = useState(1); 

  // estados para guardar lo que el usuario va escribiendo.
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');

  // estado para las alertas de la pantalla, usa un objeto que tiene el tipo (si es exito o error) y el texto que va a tener la alerta.
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // estado para habilitar y deshabilitar los botones.
  const [cargando, setCargando] = useState(false);

  // para redirigir al usuario al /login.
  const navigate = useNavigate();


  // función de solicitar código.
  const handleSolicitarCodigo = async (e) => {
    // evita que se recargue la página.
    e.preventDefault();

    // activa el estado de cargando y limpia las alertas previas.
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    // ejecuta la función para solicitar la recuperacion, le envia el correo ingresado.
    const respuesta = await solicitarRecuperacion(email);

    // si el back respopnde con éxito, pasa al paso 2, sino muestra el error.
    if (respuesta.exito) {
      setMensaje({ tipo: 'exito', texto: respuesta.mensaje });
      setPaso(2); 
    } else {
      setMensaje({ tipo: 'error', texto: respuesta.mensaje });
    }

    // desactiva la carga.
    setCargando(false);
  };

  // restablecer la contraseña. Prepara la peticion, limpia los mensajes previos y activa el cargando.
  const handleRestablecer = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    // llama a la funcion del contexto pasando un objeto con el email, el codigo y la nueva contraseña.
    const respuesta = await restablecerPassword({ email, codigo, nuevaPassword });

    // si es exitoso avisa, espera, espera unos segundos y redirige al login, sino muestra el error.
    if (respuesta.exito) {
      setMensaje({ tipo: 'exito', texto: 'Contraseña actualizada.' });
      setTimeout(() => navigate('/login'), 2500);
    } else {
      setMensaje({ tipo: 'error', texto: respuesta.mensaje });
    }

    // desactiva la carga.
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* si está en el paso 1 muestra: 'olvidate tu contraseña', si está en el paso 2 muestra: 'ingersar codigo de seguridad'. */}
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
          {paso === 1 ? '¿Olvidaste tu contraseña?' : 'Ingresar código de seguridad'}
        </h2>

        {/* si está en el paso 1 muestra: 'ingresa tu email y...', si está en el paso 2 muestra: 'revisa la bandeja de ent...'. */}
        <p className="text-slate-500 text-sm text-center mb-6">
          {paso === 1 
            ? 'Ingresá tu email registrado y te enviaremos un código de recuperación.' 
            : `Revisá la bandeja de entrada de ${email} e ingresá el código recibido.`}
        </p>

        {/* solo se muestra si mensaje.texto no está vacío.*/}
        {mensaje.texto && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium text-center ${
            mensaje.tipo === 'exito' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* si es paso 1: pedir email */}
        {paso === 1 && (

          // asigna la función que se va a ejecutar cuando el usuario apriete el botón de "enviar"
          <form onSubmit={handleSolicitarCodigo} className="space-y-4">
            <div>

              {/* de tipo email, requerido*/}
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}

                // escucha cada tecla que se presione, obtiene el valor actual de input, y actualiza el estado de email.
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              // si la petición está en curso (cargando===true), el boton se deshabilita.
              disabled={cargando}
              className="w-full bg-[#00873e] hover:bg-[#006e32] text-white font-semibold py-2.5 rounded-lg transition duration-200"
            >
              {/* si cargando está activo muestra 'enviando' sino muestra 'enviar código'. */}
              {cargando ? 'Enviando...' : 'Enviar código por email'}
            </button>
          </form>
        )}

        {/* si es paso 2: validar código y cambiar clave */}
        {paso === 2 && (

          // vincula su envío a la funcion de handleRestablecer.
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

            {/* nueva contraseña. */}
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

            {/* boton para volver. */}
            <button
              type="button"
              onClick={() => {
                // pone el estado en 1 y limpia el mensaje.
                setPaso(1);
                setMensaje({ tipo: '', texto: '' });
              }}
              className="w-full text-sm text-slate-500 hover:text-slate-700 text-center block mt-2"
            >
              ← Volver a ingresar email
            </button>
          </form>
        )}

        {/* redirige al /login.*/}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  );
}