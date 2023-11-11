import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Map from "../Map"
import SellerReview from '../components/SellerReview';

const EachProdpage = () => {
    const [cookies] = useCookies(['user']);
    const user = cookies.user;
    const navigate = useNavigate();
    const { prodid } = useParams();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [reviewdata, setreviewdata] = useState({
        userid: user.id,
        content: "",
        seller: 0
    })

    const handleInput = (e) => {
        setreviewdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlereviewsubmit = ()=>{
        try {
            const response = axios.post(`http://localhost:8081/setreview`, reviewdata);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:8081/page/${prodid}`);
                setData(response.data);
                console.log(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        }

        fetchData();
    }, [prodid]);

    const handleClick = (e) => {
        navigate('/chat2', { state: { someData: e.target.value } });
    }
    const handleClick2 = (e) => {
        navigate('/buy', { state: { someData: data[0] } });
    }

    return (
        <div className='m-2 bg-blue'>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="p-4 flex justify-center items-center">
                    <div className="w-1/2">
                        <h2 className=" bg-blue-300 m-auto p-2 rounded-2xl text-2xl font-semibold">{data[0].title}</h2>
                        <Carousel
                            showArrows={true}
                            showStatus={true}
                            showIndicators={false}
                            showThumbs={true}
                            infiniteLoop={true}
                            dynamicHeight={false}
                            width="80%" // Adjust the carousel width
                        >
                            <div className="w-96 h-96 relative">
                                <img
                                    src={`http://localhost:3000/${data[0].image1}`}
                                    alt="Slide 1"
                                    className="w-fit h-fit object-fill" // Adjust slide width and maintain aspect ratio
                                />
                                <p className="legend">Image 1</p>
                            </div>
                            <div className="w-96 h-96">
                                <img
                                    src={`http://localhost:3000/${data[0].image2}`}
                                    alt="Slide 2"
                                    className="w-fit h-fitobject-fill" // Adjust slide width and maintain aspect ratio
                                />
                                <p className="legend">Image 2</p>
                            </div>
                        </Carousel>
                    </div>
                    <div className="w-1/2">

                        <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <h1 className="text-2xl font-bold">Rs.{data[0].price}</h1>
                            <h5 className="text-xl font-semibold">Description</h5>
                            <p>{data[0].description}</p>
                            <button type="button" className="text-blue-700 border-2 border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">Add to favorite</button>
                            <button onClick={handleClick2} value={prodid} type="button" className="text-white ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                </svg>
                                Buy now
                            </button>


                            <div className="text-xl font-semibold mt-4">
                                Seller Details
                                <br></br>
                                <p>Name: {data[0].username} </p>
                                <p>Address: {data[0].location}</p>
                                <button value={data[0].seller_id} onClick={handleClick} type="button" class="px-3 py-2 text-sm font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg class="w-3 h-3 text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                    </svg>
                                    Chat with seller
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {data[0]&&<Map latitude={data[0].lat} longitude={data[0].lon}></Map>}
                <div>{data[0] && <div>{data[0].seller_id}</div>}</div>
            <div>
                {/* <h3>Seller Reviews</h3> */}
                {data[0] && <SellerReview id={data[0].seller_id}></SellerReview>}
                {/* <form onSubmit={handlereviewsubmit}>
                    <input onChange={handleInput} name='content' type='text' className='text-sm' placeholder='Enter Reviews'></input>
                    <button className='ml-2 rounded-xl border-2 p-2'>Submit</button>
                </form> */}
            </div>
        </div>
    );
};

export default EachProdpage;