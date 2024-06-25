import React from 'react'
import { useAuthStatus } from '../hooks/useAuthstatus'
import Spinner from './Spinner';
import { Navigate, Outlet, } from 'react-router';



const Privateroute = () => {
    const{loggedIn,checkingStatus}=useAuthStatus()

    if (checkingStatus) {
        return <Spinner />;
    }
    return loggedIn ? <Outlet/> : <Navigate to='/login' />
  
}

export default Privateroute
