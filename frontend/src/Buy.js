import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Buy = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies(['user']);
    const user = cookies.user;
    const data = location.state && location.state.someData;
    console.log(data);
    const [prod, setprod] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const response = await axios.get(`http://localhost:8081/page/${data}`);
    //             setprod(response.data);
    //             console.log(response.data);
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             setIsLoading(false);
    //         }
    //     }
    // }, []);
    const handleClick = (e) => {
        console.log("working");
        async function fetchData() {
                    try {
                        const response = await axios.post(`http://localhost:8081/bought/${data.product_id}/${user.id}`);
                        
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        setIsLoading(false);
                    }
                }
        fetchData();
        navigate('/Home');
    }
    
    return (<div className="flex justify-center items-center flex-wrap h-screen w-screen">

        {data&&
        
        <div class=" max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <h3>Seller Name: {data.username}</h3>
            <h3>Seller Address: {data.location}</h3>
            <h3>Product Name: {data.title}</h3>
            <h3>Product Description: {data.description}</h3>
            
            <p>Enter your address</p>
            <input type="text" placeholder="Enter address"></input>
        <button type="button" onClick={handleClick} class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Confirm</button>
        </div>
        }


    </div>);
}

export default Buy; <div>


</div>