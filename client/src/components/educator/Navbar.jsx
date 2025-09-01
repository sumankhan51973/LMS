import React from 'react';
import { assets, dummyEducatorData } from '../../assets/assets';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const educatorData = dummyEducatorData
  const {user} = useUser

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
    <Link to='/'>
          <div className="flex items-center gap-2 cursor-pointer">
          <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="StudyVerse Logo"
          className="w-14 h-14"
          />
          <span className="text-xl font-bold    text-cyan-700">StudyVerse</span> 
          </div>
       </Link>
       <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? <userButton /> : <img className='max-w-8' src={assets.profile_img} />}
       </div>
      </div>
  )
}
export default Navbar