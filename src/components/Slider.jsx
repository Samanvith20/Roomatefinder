
import { db } from '../firebase'; 
import Spinner from '../components/Spinner'; 
import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { collection, orderBy, limit, query, getDocs } from 'firebase/firestore'; 
import { Swiper, SwiperSlide } from 'swiper/react'; 
import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination'; 
import 'swiper/css/effect-fade'; 
import 'swiper/css/autoplay';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';


export default function Slider() {
   
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 
    
    useEffect(() => {
        async function getPosts() {
            
            const postsRef = collection(db, 'posts');
           
            const q = query(postsRef, orderBy('timestamp', 'desc'), limit(5));
            
            const postsSnap = await getDocs(q);
            let posts = [];
            // Loop through the documents and push them to the posts array
            postsSnap.forEach((doc) => {
                posts.push({ id: doc.id, data: doc.data() });
            });
            // Update the state with fetched posts and set loading to false
            setPosts(posts);
            setLoading(false);
        }
        getPosts(); 
    }, []);

    
    if (loading) {
        return <Spinner />;
    }
    // If no posts are available, display a message
    if (posts.length === 0) {
        return <h1 className='text-center text-2xl font-bold'>No posts to show</h1>;
    }
    
    return (
        <div>
            <Swiper
                slidesPerView={1} // Number of slides to show per view
                navigation // Enable navigation buttons
                pagination={{ type: 'progressbar' }} // Enable pagination with progress bar
                effect="fade" // Enable fade effect
                autoplay={{ delay: 2000 }} // Enable autoplay with 2 seconds delay
                modules={[Navigation, Pagination, EffectFade, Autoplay]} // Include necessary Swiper modules
            >
                {posts.map(({ data, id }) => (
                    <SwiperSlide key={id} onClick={() => navigate(`post/${id}`)}>
                        <div
                            className='relative mx-auto w-full md:w-1/2 overflow-hidden h-[400px]'
                            style={{
                                background: `url(${data.imgURLs[0]}) center no-repeat`, // Set background image
                                backgroundSize: 'cover', // Set background size to cover
                            }}
                        >
                            <p className='absolute left-2 top-3 font-medium bg-secondary text-light rounded-xl py-2 px-4 shadow-lg opacity-90'>
                                {data.bhk} apartment
                            </p>
                            <p className='absolute left-2 bottom-3 font-medium bg-green-100 text-primary rounded-xl py-2 px-4 shadow-lg opacity-90'>
                                ₹{data.rent} / month
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
