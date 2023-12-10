import { Link, useLocation } from "react-router-dom"
const Navbar = () => {
  const location = useLocation()

  return (
    <div className=' sticky flex justify-center items-center w-full top-0 z-10'>
      <nav className='backdrop-filter backdrop-blur-lg bg-opacity-50 border-b border-gray-200 w-full'>
        <div className='max-w-5xl mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            <Link to='/'>
              <span className='text-2xl text-white font-semibold'>
                Insurify{" "}
              </span>
            </Link>
            <div className='flex space-x-4 text-white items-center'>
              {location.pathname === "/users" && (
                <button
                  className='btn'
                  onClick={() =>
                    document.getElementById("createClaimModal").showModal()
                  }
                >
                  Create Claim
                </button>
              )}
              {location.pathname === "/insurer" && (
                <label htmlFor='my_modal_7' className='btn'>
                  Add Funds
                </label>
              )}
              {/* The button to open modal */}

              {/* Put this part before </body> tag */}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
