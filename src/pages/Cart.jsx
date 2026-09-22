import { useState, useEffect } from 'react'
import { obtenerItems } from '../services/api.js';
import { ShoppingCart, Trash } from 'lucide-react'
import Header from '../components/Header.jsx';
import img2 from '../assets/products/img2.jpg'
function Cart() {
  const [carrito, setCarrito] = useState([]);
  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const data = await obtenerItems('carrito')
        setCarrito(data)
        console.log(data)
      } catch (error) {
        console.error('ERROR', error.message)
      }
    }

    fetchCarrito();
  }, [])
  return (
    <div className='p-6 bg-slate-600'>
      <Header />
      <h1 className='font-bold text-2xl text-white p-5 mb-5 flex gap-1'>
        <ShoppingCart size={30} />Carrito de Compras</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <div className="overflow-x-auto bg-slate-400 p-10 rounded-lg">
            <div className="min-w-[680px] grid grid-cols-[90px_minmax(180px,1fr)_120px_160px_48px] items-center gap-4 px-2 pb-3 text-sm font-semibold uppercase tracking-wide text-gray-100">
              <span aria-hidden="true" />
              <span>Nombre</span>
              <span className="">Precio</span>
              <span>Cantidad</span>
              <span aria-hidden="true" />
            </div>

            <div className="min-w-[680px] space-y-4">
              {carrito.items?.map(item => (
                <article key={item.id} className="grid grid-cols-[90px_minmax(180px,1fr)_120px_160px_48px] items-center gap-4 rounded-lg  bg-gray-200 p-4">
                  <img src={img2} width={90} className="rounded object-cover" alt={item.producto.nombre} />
                  <h3 className="truncate font-medium">{item.producto.nombre}</h3>
                  <p className="w-16 text-right tabular-nums">${Number(item.producto.precio).toFixed()}</p>
                  <div className="flex items-center gap-10">
                    <button type="button" className='hover:cursor-pointer' aria-label="Disminuir cantidad">-</button>
                    <p>{item.cantidad}</p>
                    <button type="button" className='hover:cursor-pointer' aria-label="Aumentar cantidad">+</button>
                  </div>
                  <button className='hover:bg-red-500 rounded-full p-1 w-8 hover:cursor-pointer'>
                    <Trash />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className='sticky top-24 h-fit rounded-lg  p-6 lg:col-start-3 lg:row-start-1 bg-slate-400 text-gray-100' >
          <div className='bg-gray-950 rounded-lg justify-between w-full flex-wrap p-4'>
            <h2 className='text-center font-bold text-xl'>Resumen</h2>
            <h4>Productos</h4>
            <h4>Cantidad</h4>
            

          </div>
          <button className='text-white text-center w-full p-4 bg-blue-600 mt-3 rounded-2xl'>Pagar con mercado pago</button>
        </div>

      </div>

    </div>
  )
}

export default Cart