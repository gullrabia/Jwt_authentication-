import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate, useLocation } from "react-router-dom"
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
            if (data.success) {
                navigate('/email-verify');
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            if (data.success) {
                setIsLoggedin(false)
                setUserData(null)
                navigate('/login')
                toast.success('Logged out successfully')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 fixed top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 transition-all duration-300'>
            <img 
                src={assets.logo} 
                alt='logo' 
                className='w-28 sm:w-32 cursor-pointer transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] hover:rotate-1' 
                onClick={() => navigate('/')}
            />

            {userData ? (
                <div className='relative'>
                    <div 
                        className='w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/50 relative group'
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {userData?.name?.[0]?.toUpperCase()}
                        <div className='absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 group-hover:opacity-50 blur transition-opacity duration-300'></div>
                    </div>
                    
                    {isDropdownOpen && (
                        <>
                            <div 
                                className='fixed inset-0 z-40'
                                onClick={() => setIsDropdownOpen(false)}
                            />
                            <div className='absolute right-0 top-12 z-50 min-w-[180px] animate-in slide-in-from-top-2 duration-200'>
                                <ul className='bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden text-sm text-white border border-white/20'>
                                    {!userData.isAccountVerified && (
                                        <li 
                                            onClick={() => {
                                                sendVerificationOtp()
                                                setIsDropdownOpen(false)
                                            }} 
                                            className='px-5 py-3 hover:bg-indigo-600/50 cursor-pointer transition-all flex items-center gap-3 group'
                                        >
                                            <span className='text-lg group-hover:scale-110 transition-transform'></span>
                                            <span>Verify Email</span>
                                            {!userData.isAccountVerified && (
                                                <span className='ml-2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></span>
                                            )}
                                        </li>
                                    )}
                                    <li 
                                        onClick={() => {
                                            logout()
                                            setIsDropdownOpen(false)
                                        }} 
                                        className='px-5 py-3 hover:bg-red-600/50 cursor-pointer transition-all flex items-center gap-3 group'
                                    >
                                        <span className='text-lg group-hover:scale-110 transition-transform'></span>
                                        <span>Logout</span>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <button 
                    onClick={() => navigate('/login')} 
                    className='relative overflow-hidden group flex items-center gap-2 border border-white/30 rounded-full px-6 py-2 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105'
                >
                    <span className='relative z-10'>Login</span>
                    <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                </button>
            )}
        </div>
    )
}

export default Navbar