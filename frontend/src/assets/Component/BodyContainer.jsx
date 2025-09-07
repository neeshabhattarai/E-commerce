import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import AuthPage, { AuthContext } from './AuthPage'


export default function BodyContainer() {
  return (
    <AuthPage>

    <div className='w-screen h-screen'>
    
      <Navbar/>
     
      <Outlet/>
    </div>
    </AuthPage>
  )
}
