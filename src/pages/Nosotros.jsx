import Header from '../components/Header';
import { Link } from 'react-router-dom';

function Nosotros() {
  return (
    <div className="min-h-screen bg-[#475569] p-6 text-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <Header />
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Sobre pcBuilder</h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
               Descripcion de pcBuilder...
            </p>
            <Link 
              to="/home" 
              className="inline-block bg-[#00873e] hover:bg-[#006e32] text-white font-semibold px-5 py-2.5 rounded-lg transition duration-200 shadow-sm"
            >
              Ver Productos
            </Link>
          </div>
          <div className="w-full md:w-80 h-48 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 font-medium">
            (Poner logo/imagen de pcBuilder)
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col items-start">
            <div className="w-12 h-12 bg-slate-100 text-[#00873e] rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              ✓
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Compatibilidad asegurada</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nos encargamos de verificar que todos los componentes sean 100% compatibles, haciendo que el armado de tu PC sea rápido y sencillo.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col items-start">
            <div className="w-12 h-12 bg-slate-100 text-[#00873e] rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              ⚡︎
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Envío rápido y protegido</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nos aseguramos de que tus productos viajen protegidos para que lleguen a tus manos de manera rápida y segura.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md flex flex-col items-start">
            <div className="w-12 h-12 bg-slate-100 text-[#00873e] rounded-lg flex items-center justify-center font-bold text-xl mb-4">
              🔒︎
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Soporte técnico</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nuestro equipo te asesora antes, durante y después de tu compra para resolver cualquier duda durante la compra o en el armado de la pc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nosotros;