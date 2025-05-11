import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Links = () => {
              const pickupLocation = useSelector(state => state.pickupLocation?.data || []); // Ensure it's an array or object
       
       return (
              <div
                     className='w-full flex items-center justify-evenly gap-x-10 bg-mainColor rounded-3xl py-2'
              >
                     {/* <NavLink to={''}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                            Home
                     </NavLink> */}
                     <NavLink to={'Flaky_menu'}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                            Menu
                     </NavLink>
                     {/* <NavLink
                            to={pickupLocation && (!Array.isArray(pickupLocation) || pickupLocation.length > 0) ? '/menu' : '/location'}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                            Order Online
                     </NavLink> */}
                     <NavLink
                            to={'/location'}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                            Order Online
                     </NavLink>
                     <NavLink to={'branches'}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                            Branch
                     </NavLink>
                     <NavLink to={'/contact_us'}
                            className='text-xl font-TextFontRegular text-white pb-1'
                     >
                            Contact Us
                     </NavLink>
              </div>
       )
}

export default Links