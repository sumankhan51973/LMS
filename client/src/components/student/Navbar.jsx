import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import {Link} from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

  const {navigate, isEducator} = useContext(AppContext)


const isCourseListPage = location.pathname.includes('/course-list');

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>


      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}>
        {/* ✅ Free Education Logo (replace with your own later if you want) */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
          alt="StudyVerse Logo"
          className="w-14 h-14"
        />
        <span className="text-xl font-bold text-cyan-700">StudyVerse</span>
      </div>


      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          <button onClick={()=> {navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'} </button>
          <Link to='/my-enrollments'>My Enrollments</Link>
        </div>
        <button className='bg-cyan-600 text-white px-5 py-2 rounded-full hover:bg-cyan-800 transition duration-300 ease-in-out'>
          Create Account
        </button>
      </div>
      {/* For phone screen */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 sm:gap-5 text-gray-500'>
        <div>
        <button onClick={()=> {navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'} </button>
        <Link to='/my-enrolements'>My Enrollments</Link>
        </div>
        <button><img src={assets.user_icon}alt="" />
        </button>
      </div>
    </div>
  )
}

export default Navbar