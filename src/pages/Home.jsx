import { collection, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import Spinner from '../components/Spinner'

import Slider from '../components/Slider'
import Post from '../components/Post'

const Home = () => {
    const[posts,setPosts]=useState()
    const[loading,setLoading]=useState(true)
    useEffect(()=>{
      async function fetchUserPosts(){
          try {
            const postRef= collection(db,"posts")
            const q = query(postRef, orderBy('timestamp', 'desc'));
               const userPosts=await getDocs(q)
               let posts=[]
               userPosts.forEach((doc) => {
                return posts.push({ data: doc.data(), id: doc.id });
            });
            setPosts(posts)
            setLoading(false);
          } catch (error) {
            console.log(error)
          }
      }
      fetchUserPosts()
    },[])
    if (loading) {
        return <Spinner />
    }
  return (
    <div>
       <Slider />
            <div className='max-w-6xl mx-auto my-12'>
                <h1 className='text-primary text-4xl font-bold '>Recent Posts </h1>
                <ul className='mt-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            post={post.data}
                            id={post.id}
                        />
                    ))}
                </ul>
            </div>
    </div>
  )
}

export default Home
