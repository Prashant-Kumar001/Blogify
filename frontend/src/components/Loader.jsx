import React from 'react'

const Loader = () => {
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <span className="loading loading-ring loading-xs"></span>
            <span className="loading loading-ring loading-sm"></span>
            <span className="loading loading-ring loading-md"></span>
            <span className="loading loading-ring loading-lg"></span>
        </div>
    )
}

export default Loader