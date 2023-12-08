const Navbar = () => {
  return (
    <div className=' sticky flex justify-center items-center w-full top-0 z-10'>
      <nav className='backdrop-filter backdrop-blur-lg bg-opacity-50 border-b border-gray-200 w-full'>
        <div className='max-w-5xl mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            <span className='text-2xl text-white font-semibold'>Logo</span>
            <div className='flex space-x-4 text-white'>
              <a href='#'>Dashboard</a>
              <a href='#'>About</a>
              <a href='#'>Projects</a>
              <a href='#'>Contact</a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
