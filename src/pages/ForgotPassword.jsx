import React, { useState } from 'react'

import { Link } from 'react-router-dom';

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { db } from '../firebase'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Oauth from '../components/Oauth';

function ForgotPassword() {
    const [email, setEmail] = useState("");

    function onChange(e) {

        setEmail(e.target.value);

    }

    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success(`Reset link sent to ${email}`);
            navigate('/login');
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <section>
            <h1 className='text-3xl text-center text-primary my-6 font-bold'>Forgot Password</h1>
            <div className='flex flex-col md:flex-row  flex-wrap justify-center items-center px-6 py-12
                max-w-6xl mx-auto'>
                <div className='w-full md:w-[50%] mb-12 pt-12'>
                    <img className='w-full rounded-xl'
                        alt='Forgot Password'
                        src='https://images.unsplash.com/photo-1618060932014-4deda4932554?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80' width={500} height={500} />
                </div>
                <div className='w-full md:w-[40%] md:ml-20'>
                    <form onSubmit={onSubmit}>
                        <input className='w-full justify-center px-4 py-2 text-xl text-secondary
                           border-primary rounded-xl transition ease-in-out'
                            type='email' id="email" value={email} onChange={onChange}
                            placeholder='Email Address' />
                        <div className='text-primary py-4 flex flex-row flex-wrap justify-between'>
                            <p>
                                Don&apos;t have an account?&nbsp;
                                <Link to='/login' className='font-semibold
                                     hover:text-secondary hover:underline 
                                     '>
                                    Register
                                </Link>
                            </p>
                            <p>
                                <Link to='/login' className='font-semibold hover:text-secondary hover:underline '>
                                    Login Instead
                                </Link>
                            </p>
                        </div>



                        <button className='mt-6 w-full justify-center px-4 py-3 text-xl text-light
                            border-primary rounded-xl transition ease-in-out bg-secondary
                            hover:bg-accent hover:text-primary'
                            type='submit'>
                            Send Reset Link
                        </button>
                        <div className='my-4 flex items-center
                        before:border-t before:border-secondary before:flex-1
                    after:border-t after:border-secondary after:flex-1
                        '>
                            <p className='text-center text-primary font-semibold mx-2'>OR</p>
                        </div>

                        <Oauth />

                    </form>
                </div>
            </div>
        </section >
    )
}

export default ForgotPassword