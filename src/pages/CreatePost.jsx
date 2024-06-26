import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/Spinner';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router';

const CreatePost = () => {
    const [loading, setLoading] = useState(false);
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        vacancy: 1,
        washroom: "indian",
        ac: true,
        wifi: true,
        furnished: true,
        gender: "male",
        bhk: "1 HK",
        rent: 0,
        address: "",
        description: "",
        lat: 0,
        lng: 0,
        images: [],
    });
    const navigate=useNavigate()
     
    const { name, contact, vacancy, washroom, ac, wifi, furnished, gender, bhk, rent, address, description, lat, lng, images } = formData;

    const onChange = (e) => {
        let boolean = null;
        if (e.target.value === 'true') {
            boolean = true;
        }
        if (e.target.value === 'false') {
            boolean = false;
        }

        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }

        // Text/Booleans/Numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    };

    async function onSubmit(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        toast.info("Please wait while we create your post"); // Inform the user that the post is being created
        setLoading(true); // Set the loading state to true
    
        // Check if the number of images exceeds the limit
        if (images.length > 6) {
            setLoading(false); // Reset the loading state
            toast.error("Maximum 6 images allowed"); // Show an error message
            return;
        }
    
        let geolocation = {};
        let location;
    
        // const apiKey = process.env.REACT_APP_GEOCODE_API; // Replace with your actual HERE API key
        // console.log(apiKey);
        if (geoLocationEnabled) {
            try {
                const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=fed63bba9d9b46feaf040ecc0adffeba`);
                if (!res.ok) {
                  throw new Error(`HTTP error! status: ${res.status}`);
                }
                console.log(address);
                const data = await res.json();
                console.log(data);
                if (data.results && data.results.length > 0) {
                  geolocation.lat = data.results[0].geometry.lat;
                  geolocation.lng = data.results[0].geometry.lng;
                  location = true;
                } else {
                  location = false;
                }
              } catch (error) {
                console.error('Error fetching geocode data:', error);
                location = false;
              }
        
              // If the address is invalid, show an error message and exit
              if (!location) {
                setLoading(false); // Reset the loading state
                toast.error("Invalid Address"); // Show an error message
                return;
              }
            } else {
              // If geolocation is not enabled, use the provided lat and lng
              geolocation.lat = lat;
              geolocation.lng = lng;
            }
    
            // If the address is invalid, show an error message and exit
            if (!location) {
                setLoading(false); // Reset the loading state
                toast.error("Invalid Address"); // Show an error message
                return;
            }
         else {
            // If geolocation is not enabled, use the provided lat and lng
            geolocation.lat = lat;
            geolocation.lng = lng;
        }
    
        // Function to upload a single image and return the download URL
        async function storeImage(image) {
            return new Promise((resolve, reject) => {
                const storage = getStorage(); // Get Firebase storage instance
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`; // Create a unique filename
                const storageRef = ref(storage, filename); // Create a reference to the storage location
                const uploadTask = uploadBytesResumable(storageRef, image); // Start the upload task
    
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    },
                    (error) => {
                        // Handle any errors during the upload
                        reject(error);
                    },
                    () => {
                        // Get the download URL once the upload is complete
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        }
    
        // Upload all images and get store the download URLs
        const imgURLs = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((err) => {
            setLoading(false);
            toast.error("Error uploading images");
            return;
        });
    
        // Prepare the form data to be saved to Firestore
        const formDataCopy = {
            ...formData,
            imgURLs,
            geolocation,
            timestamp: serverTimestamp(), // Add the current timestamp
            userRef: auth.currentUser.uid // Add the current user's reference
        };
    
        // Remove unnecessary fields from the form data
        delete formDataCopy.images;
        delete formDataCopy.lat;
        delete formDataCopy.lng;
    
        // Save the post to Firestore
        const docRef = await addDoc(collection(db, "posts"), formDataCopy);
    
        setLoading(false);
        toast.success("Post created successfully"); // Show a success message
        navigate(`/post/${docRef.id}`); // Navigate to the new post's page
    }
    
    
    
    if (loading) {
        return <Spinner />;  // Show a spinner if loading
    }
    

    return (
        <div>
            <div className='max-w-md px-2 mx-auto'>
                <h1 className='text-3xl text-center text-primary my-6 font-bold mb-12'>Create Post</h1>

                <form onSubmit={onSubmit}>
                    <p className='text-primary text-2xl font-semibold'>Your Name:</p>
                    <input type='text' id='name' value={name} onChange={onChange} required
                        className='w-full border border-primary rounded-md p-2 mb-2' />

                    <p className='text-primary text-2xl font-semibold'>Your Contact Number:</p>
                    <div className='flex mb-6 justify content w-full mx-auto items-center'>
                        <p className='w-[10%]  text-center'>+91</p>
                        <input type='number' id='contact' value={contact} onChange={onChange} required
                            min="1000000000" max="9999999999"
                            className='w-[90%] border border-primary rounded-md p-2' />
                    </div>

                    <p className='text-primary text-2xl font-semibold'>Number of Roommates vacancy:</p>
                    <input type='number' id='vacancy' value={vacancy} onChange={onChange} required
                        min="1" max="100"
                        className='w-full border border-primary rounded-md p-2 mb-2' />

                    <div className='flex mb-6'>
                        <button
                            type='button'
                            value="male"
                            id="gender"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent  w-full
                                ${gender === "male" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            Male
                        </button>
                        <button
                            type='button'
                            value="female"
                            id="gender"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${gender === "female" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            Female
                        </button>
                    </div>

                    <p className='text-primary text-2xl font-semibold'>Rent (per person):</p>
                    <div className='flex mb-4 justify content w-full mx-auto'>
                        <input type='number' id='rent' value={rent} onChange={onChange} required
                            min="1" max="100000"
                            className='w-[80%] border border-primary rounded-md p-2' />
                        <p className='w-[20%] mt-1 text-center'>₹ / month</p>
                    </div>

                    <p className='text-primary text-2xl font-semibold'>AC Facility?</p>
                    <div className='flex mb-4'>
                        <button
                            type='button'
                            value={true}
                            id="ac"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent  w-full
                                ${ac ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            Yes
                        </button>
                        <button
                            type='button'
                            value={false}
                            id="ac"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${!ac ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            No
                        </button>
                    </div>
                    <p className='text-primary text-2xl font-semibold'>Wifi Provided?</p>
                    <div className='flex mb-4'>
                        <button
                            type='button'
                            value={true}
                            id="wifi"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent  w-full
                                ${wifi ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            Yes
                        </button>
                        <button
                            type='button'
                            value={false}
                            id="wifi"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${!wifi ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            No
                        </button>
                    </div>
                    <p className='text-primary text-2xl font-semibold'>Furnished?</p>
                    <div className='flex mb-4'>
                        <button
                            type='button'
                            value={true}
                            id="furnished"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent  w-full
                                ${furnished ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            Yes
                        </button>
                        <button
                            type='button'
                            value={false}
                            id="furnished"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${!furnished ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            No
                        </button>
                    </div>
                    <p className='text-primary text-2xl font-semibold'>How many rooms?</p>
                    <div className='grid grid-cols-3 gap-2 mb-4'>
                        <button
                            type='button'
                            value="1 HK"
                            id="bhk"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent  w-full
                                ${bhk === "1 HK" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            1 RK / 1 HK
                        </button>
                        <button
                            type='button'
                            value="1 BHK"
                            id="bhk"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${bhk === "1 BHK" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            1 BHK
                        </button>
                        <button
                            type='button'
                            value="2 BHK"
                            id="bhk"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${bhk === "2 BHK" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            2 BHK
                        </button>
                        <button
                            type='button'
                            value="3 BHK"
                            id="bhk"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${bhk === "3 BHK" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            3 BHK
                        </button>
                        <button
                            type='button'
                            value="4 BHK"
                            id="bhk"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${bhk === "4 BHK" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            4 BHK
                        </button>
                        <button
                            type='button'
                            value="5 BHK"
                            id="bhk"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${bhk === "5 BHK" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            5 BHK
                        </button>
                    </div>
                    <p className='text-primary text-2xl font-semibold'>Washroom Type:</p>
                    <div className='flex mb-4'>
                        <button
                            type='button'
                            value="indian"
                            id="washroom"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent  w-full
                                ${washroom === "indian" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            Indian
                        </button>
                        <button
                            type='button'
                            value="western"
                            id="washroom"
                            onClick={onChange}
                            className={
                                `mr-3 px-7 py-3 text-md uppercase shadow-md rounded-xl
                                transition duration-150 ease-in-out hover:shadow-secondary
                                border-accent w-full
                                ${washroom === "western" ? "bg-secondary text-light border-0" : "bg-light text-primary border-2"
                                }`
                            }>
                            Western
                        </button>
                    </div>
                    <p className='text-primary text-2xl font-semibold'>Address:</p>
                    <textarea type='text' id='address' value={address} onChange={onChange} required
                        className='w-full border border-primary rounded-md p-2 mb-4 ' />
                    <div>
                        {!geoLocationEnabled && <p className='text-primary text-2xl font-semibold'>Latitude:</p>}
                        {!geoLocationEnabled && <input type='number' id='lat' value={lat} onChange={onChange} required
                            min="-90" max="90"
                            className='w-full border border-primary rounded-md p-2 mb-4 ' />}
                        {!geoLocationEnabled && <p className='text-primary text-2xl font-semibold'>Longitude:</p>}
                        {!geoLocationEnabled && <input type='number' id='lng' value={lng} onChange={onChange} required
                            min="-180" max="180"
                            className='w-full border border-primary rounded-md p-2 mb-4 ' />}
                    </div>

                    <p className='text-primary text-2xl font-semibold mt-4'>Additional Description/Details:</p>
                    <textarea type='text' id='description' value={description} onChange={onChange}
                        className='w-full border border-primary rounded-md p-2 mb-4 ' />

                    <div className='mb-4'>
                        <p className='text-primary text-2xl font-semibold'>Images (Max. 6):</p>
                        <p className='text-primary text-xl'>The first image will be the cover:</p>
                        <input type='file' id='images' onChange={onChange}
                            accept='.jpg, .jpeg, .png'
                            multiple
                            required
                            className='w-full border border-primary rounded-md p-2 mt-2 mb-4 ' />
                    </div>

                    <button type="submit" className='mb-12 w-full bg-primary p-4 text-light text-xl rounded-xl hover:bg-accent font-semibold shadow-md shadow-black
                        transition duration-150 ease-in-out hover:shadow-secondary'>
                        Submit Post
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default CreatePost;
