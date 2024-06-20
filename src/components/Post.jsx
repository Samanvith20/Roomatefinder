import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn, MdEdit } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'

const Post = ({ post, id, onEdit, onDelete }) => {
  return (
    <div>
       <li className='bg-white flex flex-col justify-between items-center shadow-md
        hover:shadow-xl rounded-lg overflow-hidden transition-shadow duration-150 pb-4 relative'>
            <Link to={`/post/${id}`}>
                <img
                    className='w-72 h-48 object-cover 
                    aspect-square
                    hover:scale-105 transition-scale duration-150 ease-in'
                    src={post.imgURLs[0]}
                    loading='lazy'
                    alt="img" />
                <div className='px-4 w-full'>
                    <div className='flex items-center flex-wrap'>
                        <MdLocationOn className='h-4 w-4 text-red-500' />
                        <p className='font-semibold text-sm my-2 text-gray-700 truncate'>
                            {post.address}
                        </p>
                    </div>
                    <p className='font-semibold text-lg'>{post.bhk} apartment</p>
                    <p className='text-secondary font-bold'> ₹{post.rent}  / month</p>
                </div>

            </Link>
            {onEdit && (
                <MdEdit
                    className='absolute bottom-2 right-7 h-[18px] w-auto  cursor-pointer text-primary hover:text-accent'
                    onClick={() => onEdit(post.id)} />

            )}
            {onDelete && (
                <FaTrash
                    className='absolute bottom-2 right-2 cursor-pointer text-red-500 hover:text-red-800'
                    onClick={() => onDelete(post.id)} />

            )}
        </li>
    </div>
  )
}

export default Post
