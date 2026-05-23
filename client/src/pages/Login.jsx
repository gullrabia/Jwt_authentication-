import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      axios.defaults.withCredentials = true;

      // ✅ FRONTEND VALIDATION (prevents 400 error)
      if (state === 'Sign Up' && (!name || !email || !password)) {
        return toast.error("All fields are required");
      }

      if (state === 'Login' && (!email || !password)) {
        return toast.error("Email and password required");
      }

      let data;

      // 🔥 REGISTER
      if (state === 'Sign Up') {

        const res = await axios.post(
          `${backendUrl}/api/auth/register`,
          { name, email, password }
        );

        data = res.data;

      } 
      // 🔥 LOGIN
      else {

        const res = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password }
        );

        data = res.data;
      }

      // ✅ SUCCESS HANDLING
      if (data.success) {

        setIsLoggedin(true);
        await getUserData();

        // clear form
        setName('');
        setEmail('');
        setPassword('');

        navigate('/');

      } else {
        toast.error(data.message);
      }

    } catch (error) {

      console.log("AUTH ERROR:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className='absolute left-5 sm:left-20 top-5 w-32 cursor-pointer'
      />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-2xl font-bold mb-2'>
          {state === 'Sign Up' ? 'Create your Account' : 'Login'}
        </h2>

        <p className='mb-6 text-gray-500'>
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account'}
        </p>

        <form onSubmit={onSubmitHandler}>

          {/* NAME */}
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt='' />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none w-full'
                type='text'
                placeholder='Full Name'
              />
            </div>
          )}

          {/* EMAIL */}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='' />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none w-full'
              type='email'
              placeholder='Email Id'
            />
          </div>

          {/* PASSWORD */}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='' />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none w-full'
              type='password'
              placeholder='Password'
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-indigo-500 cursor-pointer'
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
          >
            {state}
          </button>

          {/* SWITCH MODE */}
          {state === 'Sign Up' ? (
            <p className='text-gray-400 text-center text-xs mt-4'>
              Already have an account?{" "}
              <span
                onClick={() => setState('Login')}
                className='text-blue-400 cursor-pointer underline'
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className='text-gray-400 text-center text-xs mt-4'>
              Don't have an account?{" "}
              <span
                onClick={() => setState('Sign Up')}
                className='text-blue-400 cursor-pointer underline'
              >
                Sign Up
              </span>
            </p>
          )}

        </form>
      </div>
    </div>
  );
};

export default Login;