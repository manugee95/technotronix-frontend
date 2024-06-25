import React from 'react'

function Card({children}) {
  return (
    <div className="border border-black w-[280px] text-center rounded-lg shadow-xl pb-[10px]">
        {children}
    </div>
  )
}

export default Card