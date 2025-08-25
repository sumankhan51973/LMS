import React from 'react'
import { assets } from '../../assets/assets'

const Comapanies = () => {
  return (
    <div className= 'pt-16'>
      <p className='text-base text-gray-600'>Trusted by learner from</p>
      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5'>
        <img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28' />
        <img src={assets.paypal_logo} alt="Paypal" className='w-20 md:w-28' />
      </div>
    </div>
  )
}

export default Comapanies