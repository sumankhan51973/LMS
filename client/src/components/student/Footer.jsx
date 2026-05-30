import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white w-full mt-20'>
      <div className='max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12'>

        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 border-b border-gray-700 pb-10'>

          {/* Logo & About */}
          <div className='lg:col-span-6'>
            <a href="/" className='flex items-center gap-3 mb-4'>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                alt="StudyVerse Logo"
                className="w-12 h-12"
              />
              <h2 className='text-2xl font-bold'>StudyVerse</h2>
            </a>

            <p className='text-gray-400 text-sm leading-6 max-w-lg'>
              StudyVerse is a Learning Management System (LMS) developed
              using the MERN Stack. The platform enables students to explore courses, learn from expert instructors, track
              their progress, and enhance their skills through an
              interactive online learning experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className='lg:col-span-3'>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>

            <ul className='space-y-3 text-gray-400'>
              <li>
                <a href="/" className='hover:text-white transition'>
                  Home
                </a>
              </li>

              <li>
                <a href="/course-list" className='hover:text-white transition'>
                  Courses
                </a>
              </li>

            
            </ul>
          </div>

          {/* Contact */}
          <div className='lg:col-span-3'>
            <h3 className='text-lg font-semibold mb-4'>Contact Us</h3>

            <div className='space-y-3 text-gray-400'>
              <p>📧 support@studyverse.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 India</p>
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}

export default Footer