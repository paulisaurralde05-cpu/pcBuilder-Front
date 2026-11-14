import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx';

const AdminProtegido = () => {
    const { user, token } = useContext(UserContext) || {};

    const activeToken = token || localStorage.getItem('token');
    
    let activeUser = user;
    if (!activeUser || !Object.keys(activeUser).length) {
        try {
            activeUser = JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            activeUser = {};
        }
    }

    const isAuthenticated = Boolean(activeToken);
    const userRole = activeUser?.role || activeUser?.rol || '';
    const isAdmin = userRole.toLowerCase() === 'admin';

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtegido;