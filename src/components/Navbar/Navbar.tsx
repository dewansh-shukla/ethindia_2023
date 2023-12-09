import { Link, useLocation } from "react-router-dom"
const Navbar = () => {
  const location = useLocation()

  return (
    <div className=' sticky flex justify-center items-center w-full top-0 z-10'>
      <nav className='backdrop-filter backdrop-blur-lg bg-opacity-50 border-b border-gray-200 w-full'>
        <div className='max-w-5xl mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            <Link to='/'>
              <span className='text-2xl text-white font-semibold'>Logo</span>
            </Link>
            <div className='flex space-x-4 text-white items-center'>
              <a href='#'>Dashboard</a>
              <a href='#'>About</a>
              <a href='#'>Projects</a>
              <a href='#'>Contact</a>
              {location.pathname === "/users" && (
                <button
                  className='btn'
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                >
                  Create Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
