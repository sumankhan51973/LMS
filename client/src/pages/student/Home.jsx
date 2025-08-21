import React from 'react'
import Hero from '../../components/student/Hero'
import Comapanies from '../../components/student/Comapanies'
import CoursesSection from '../../components/student/CoursesSection'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero />
      <Comapanies />
      <CoursesSection />
    </div>
  )
}

export default Home