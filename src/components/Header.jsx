import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {  onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';


function Header() {
    const [pageState, setPageState] = useState("Login");
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setPageState(user ? "Profile" : "Login");
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth]);

    const pathMatchRoute = (route) => location?.pathname === route;

    return (
        <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
            <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
                <div className='flex items-center py-1 cursor-pointer' onClick={() => navigate("/")}>
                    <img src="./logo .png" alt='logo' className='w-[50px] h-[50px]' />
                    <h1 className='text-3xl text-primary font-'>Roomate Finder</h1>
                </div>
                <div>
                    <ul className='flex space-x-10 text-sm font-bold text-secondary'>
                        <li
                            className={`cursor-pointer py-3 border-b-[3px] border-transparent ${pathMatchRoute("/") && "text-primary border-b-accent"}`}
                            onClick={() => navigate("/")}
                        >
                            Home
                        </li>
                        <li
                            className={`cursor-pointer py-3 border-b-[3px] border-transparent ${(pathMatchRoute("/login") || pathMatchRoute("/profile")) && "text-primary border-b-accent"}`}
                            onClick={() => navigate("/profile")}
                        >
                            {pageState}
                        </li>
                    </ul>
                </div>
            </header>
        </div>
    );
}

export default Header;
