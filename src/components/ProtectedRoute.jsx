import React from 'react';
import {Navigate} from 'react-router-dom';
import {useContext} from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({children,role}) => {

    const {user,loading} = useContext(AuthContext);

    if (loading) return <div>Cargando...</div>; 
    
    if(!user) return <Navigate to='/' />;
    if(role && user.role !== role) return <Navigate to='/' />;

    return children;
}
 
export default ProtectedRoute;