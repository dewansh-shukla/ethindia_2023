import Navbar from "../../components/Navbar/Navbar"
import { Outlet } from "react-router-dom"

const Dashboard = () => {
  return (
    <div className='min-h-screen w-full flex-col'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Dashboard
