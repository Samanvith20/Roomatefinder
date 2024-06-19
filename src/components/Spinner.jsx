import React from 'react'
import spinner from '../assets/loading.svg'

function Spinner() {
    return (
        <div className='bg-light bg-opacity-50 flex items-center justify-center z-[100]
        fixed top-0 left-0 w-screen h-screen
        '>
            <div>
                <img src={spinner} alt='Loading...' className='w-[50px] h-[50px]' />
            </div>
        </div>
    )
}

export default Spinner