import React from 'react'
import { useAuthStatus } from '../hooks/useAuthstatus'
import Spinner from './Spinner';
import { Navigate, } from 'react-router';
import Profile from './Profile';

const Privateroute = () => {
    const{loggedIn,checkingStatus}=useAuthStatus()

    if (checkingStatus) {
        return <Spinner />;
    }
    return loggedIn ? <Profile /> : <Navigate to='/login' />
  
}

export default Privateroute
