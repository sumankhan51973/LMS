import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'


const Hero = () => {
  return (
    <div className='flex flex-col items-center  justify-center w-full md:pt-36 pt-20 px-7 md:px-0 pace-y-7 text-center bg-gardient-to-b fro-cyan-100/70'>
       <h1 className='md:text-home-heading-larger text-home-heading-small relative font-bold text-gray-800 max-w-2xl mx-auto'>Hello Learner! <span className='text-lime-600'> Ready to explore knowledge at your fingertips?</span><img src={assets.sketch}alt="sketch" className='md:block hidden absolute -bottom-1 right-0' /></h1>

       <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>
        
        An all-in-one degital learning hub for students and educators. Simplifying teaching while making learning engaging and fun</p>

       <p className='md:hidden text-gray-500 max-w-sm mx-auto'>Empowering students and teachers through digital education.</p>
       <SearchBar/>
    </div>
  )
}

export default Hero