import React from "react"
import Navbar from "../components/Navbar/Navbar"
import { Outlet } from "react-router-dom"

const index = () => {
  return (
    <div className='min-h-screen w-full'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default index
