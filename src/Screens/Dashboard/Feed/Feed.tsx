import React from "react"

const Feed = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div className='w-1/2 h-20 bg-white my-2 rounded-md text-black'>x</div>
      ))}
    </div>
  )
}

export default Feed
