import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import image from '../../assets/Images/contact.png'

const ContactusPage = () => {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [describtion ,setDescribtion]= useState('')
  return (
<div className="flex flex-col-reverse md:flex-row min-h-screen justify-center bg-gray-50 py-4 lg:py-10 px-4">
 
 {/* Left Section: Contact Form */}
 <div className="contact-left w-full md:w-1/2 flex flex-col p-2 space-y-3">
  <div className="title mb-3 text-center md:text-left">
    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 leading-tight">
      We are happy to answer your  
    </h2>
    <h2 className="text-2xl md:text-4xl font-extrabold text-mainColor leading-tight">
      questions at any time.
    </h2>
    <p className="text-gray-600 mt-2 text-lg">
      Feel free to reach out with any inquiries. We're here to help!
    </p>
  </div>

  <form className="flex flex-col space-y-3">
    <input 
      type="text" 
      placeholder="Full Name" 
      className="bg-gray-200 shadow-sm p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-mainColor transition-all"
    />
    <input 
      type="email" 
      placeholder="Email" 
      className="bg-gray-200 shadow-sm p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-mainColor transition-all"
    />
    <textarea
      placeholder="Message"
      rows="4"
      className="bg-gray-200 shadow-sm p-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-mainColor transition-all resize-none"
    ></textarea>
    
    <Link 
      to={''} 
      className="self-center md:self-start text-lg text-center w-full md:w-auto text-white bg-mainColor px-6 py-3 rounded-lg font-semibold 
                 hover:bg-transparent hover:text-mainColor border-2 border-mainColor transition-all ease-in-out duration-300">
      Send Message
    </Link>
  </form>
</div>

{/* Right Section: Image (Appears first on small screens) */}
<div className="contact-right w-full md:w-1/2 flex items-center justify-center p-2 lg:p-4">
  <div className="relative w-full md:w-4/5 h-40 md:h-80 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
    <img 
      src={image} 
      alt="Contact Us" 
      className="w-full h-full object-cover"
    />
  </div>
</div>

</div>
  )
}

export default ContactusPage