import React, { useState } from 'react';
import Oauth from '../components/Oauth';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';

const Authentication = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const { email, password, name } = formData;
    const [showPassword, setShowPassword] = useState(false);
    const [signIn, setSignIn] = useState(true);
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    async function onSubmit(e) {
        e.preventDefault();

        if (signIn) {
            // Handle sign-in logic
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                if (user) {
                    navigate('/');
                    toast.success(`Welcome ${user.displayName || email}`);
                }
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            // Handle sign-up logic
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await updateProfile(auth.currentUser, {
                    displayName: name
                });

                const formDataCopy = { ...formData };
                delete formDataCopy.password;

                // Store user data in Firestore
                await setDoc(doc(db, "users", user.uid), formDataCopy);

                toast.success('Account created successfully');
                navigate('/');
            } catch (error) {
                // Specific error handling
                if (error.code === 'auth/email-already-in-use') {
                    toast.error('Email already in use. Please try another email.');
                } else if (error.code === 'auth/weak-password') {
                    toast.error('Password is too weak. Please enter a stronger password.');
                } else {
                    toast.error(error.message);
                }
            }
        }
    }

    return (
        <section>
            <h1 className='text-3xl text-center text-primary my-6 font-bold'>
                {signIn ? 'Sign In' : 'Sign Up'}
            </h1>
            <div className='flex flex-col md:flex-row flex-wrap justify-center items-center px-6 py-12 max-w-6xl mx-auto'>
                <div className='w-full md:w-[50%] mb-12 pt-12'>
                    <img className='w-full rounded-xl'
                        alt={signIn ? 'Sign In' : 'Sign Up'}
                        src='https://images.unsplash.com/photo-1618060932014-4deda4932554?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80'
                        width={500} height={500} />
                </div>
                <div className='w-full md:w-[40%] md:ml-20'>
                    <form onSubmit={onSubmit}>
                        {!signIn && (
                            <input className='w-full justify-center px-4 py-2 text-xl text-secondary border-primary rounded-xl transition ease-in-out'
                                type='text' id="name" value={name} onChange={onChange}
                                placeholder='Name' />
                        )}
                        <input className='mt-6 w-full justify-center px-4 py-2 text-xl text-secondary border-primary rounded-xl transition ease-in-out'
                            type='email' id="email" value={email} onChange={onChange}
                            placeholder='Email Address' />
                        <div className='relative'>
                            <input className='mt-6 w-full justify-center px-4 py-2 text-xl text-primary border-primary rounded-xl transition ease-in-out'
                                type={showPassword ? "text" : "password"} id="password" value={password} onChange={onChange}
                                placeholder='Password' />
                            {showPassword ?
                                <AiFillEye className='absolute right-3 top-9 text-xl cursor-pointer'
                                    onClick={() => setShowPassword(!showPassword)} />
                                :
                                <AiFillEyeInvisible className='absolute right-3 top-9 text-xl cursor-pointer'
                                    onClick={() => setShowPassword(!showPassword)} />
                            }
                        </div>
                        <div className='text-primary py-4 flex flex-row flex-wrap justify-between'>
                            <p>
                                {signIn ? "Don't have an account?" : "Already have an account?"}&nbsp;
                                <span className='font-semibold cursor-pointer hover:text-secondary hover:underline'
                                    onClick={() => setSignIn(!signIn)}>
                                    {signIn ? "Sign Up" : "Sign In"}
                                </span>
                            </p>
                            {signIn&&<Link to='/forgotpassword' className='font-semibold hover:text-secondary hover:underline '>
                                    Forgot Password?
                                </Link>
}
                        </div>
                        <button className='w-full justify-center px-4 py-3 text-xl text-light border-primary rounded-xl transition ease-in-out bg-secondary hover:bg-accent hover:text-primary'
                            type='submit'>
                            {signIn ? 'Sign In' : 'Sign Up'}
                        </button>
                        <div className='my-4 flex items-center before:border-t before:border-secondary before:flex-1 after:border-t after:border-secondary after:flex-1'>
                            <p className='text-center text-primary font-semibold mx-2'>OR</p>
                        </div>
                        <Oauth />
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Authentication;
