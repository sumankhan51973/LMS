import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

  const {allCourses} = useContext(AppContext)

  return (
    <div className='py-16 md:px=40 px-8'>
      <h1 className='text-3xl font-medium text-blue-800'>Learn from the best</h1>
      <p className='text-sm md:text-base text-cyan-600 mt-2'>Discover our top-relate courses across various catagories. From coding and design to <br></br>business and wellness, our courses are crafted to deliver results</p>

      <div className='grid grid-cols-auto px-4 md:px-0 md:my-16 my-7 gap-4'>
        {allCourses.slice(0,4).map((course, index)=> <CourseCard key={index} course={course}/>)}
      </div>

      <Link to={'/course-list'} onClick={()=> scrollTo(0,0)} className='bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-800 transition duration-300 ease-in-out'>Show all courses</Link>
    </div>
  )
}

export default CoursesSection