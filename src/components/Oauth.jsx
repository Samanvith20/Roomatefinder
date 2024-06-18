import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; 

const Oauth = () => {
    const navigate = useNavigate();

    const onGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                toast.success("User already exists");
            } else {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    createdAt: new Date() 
                });
            }

            toast.success(`Welcome ${user.displayName}`);
            navigate('/');
        } catch (error) {
            const errorMessage = error.message;
            toast.error(errorMessage);
        }
    }

    return (
        <button type='button'
                className='w-full justify-center px-4 py-3 text-xl text-light
                rounded-xl transition ease-in-out bg-red-600
                hover:bg-red-200 hover:text-red-700 flex items-center'
                onClick={onGoogleClick}>
            <FcGoogle className='mr-2 text-2xl rounded-full' />
            Continue with Google
        </button>
    )
}

export default Oauth;
