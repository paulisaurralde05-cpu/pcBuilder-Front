export const getImagenUrl = (imagen) => { 
    // si el producto no tiene foto, devuelve inmediatamente la ruta de una imagen por defecto. 
    if (!imagen) return '/placeholder.png'; 

    // comprueba si la cadena empieza con `http://` o `https://`. 
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) { 
        return imagen; 
    } 

    // dirección de tu servidor backend. 
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // evita el error de tener una doble barra diagonal en la URL, si backendUrl termina con '/', se la quita usando .slice(0, -1). Si no la tiene, la deja intacta. 
    const baseUrlLimpia = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl; 

    // une la URL del servidor con la ruta relativa de Multer que viene de la base de datos. 
    return `${baseUrlLimpia}${imagen}`; 
};