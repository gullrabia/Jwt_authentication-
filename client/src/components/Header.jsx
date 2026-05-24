import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { userData } = useContext(AppContext);
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = `Hey ${userData?.name ?? "Developer"} `;

  useEffect(() => {
    let i = 0;
    setIsTypingComplete(false);
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [userData?.name]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 text-center relative z-10'>
      {/* Animated background rings */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-indigo-500/10 rounded-full animate-spin-slow'></div>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-purple-500/10 rounded-full animate-spin-slow' style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-pink-500/10 rounded-full animate-spin-slow' style={{ animationDuration: '15s' }}></div>
      </div>

      {/* Glowing avatar container */}
      <div className='relative group'>
        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-ring'></div>
        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500'></div>
        <img
          src={assets.header_img}
          alt='avatar'
          className='w-36 h-36 rounded-full border-4 border-white/30 shadow-2xl relative z-10 animate-float'
        />
      </div>

      <h1 className='flex items-center gap-2 text-3xl sm:text-5xl font-bold mt-8 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'>
        {displayText}
        {!isTypingComplete && (
          <span className='w-0.5 h-8 sm:h-10 bg-gradient-to-r from-indigo-400 to-pink-400 animate-pulse'></span>
        )}
      </h1>

      <h2 className='text-4xl sm:text-6xl font-extrabold mt-4 leading-atight animate-in fade-in slide-in-from-bottom-4 duration-700'>
        Welcome to our{' '}
        <span className='bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]'>
          app
        </span>
      </h2>

      <p className='mt-6 max-w-md text-gray-300 text-lg backdrop-blur-sm bg-white/5 px-6 py-3 rounded-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100'>
        Let's start with a quick product tour  we'll have you up and running in no time.
      </p>

      <button className='group relative mt-8 overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-10 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200'>
        <span className='relative z-10 flex items-center gap-2'>
           Get Started
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500'></div>
      </button>
    </div>
  );
};

export default Header;