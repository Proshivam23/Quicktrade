import { useEffect, useState } from 'react';
import Navbar from './Navbar2'
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";



const Favourites = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const user = cookies.user;
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState(null);

    const [data, setData] = useState([])

    useEffect(() => {
        async function fetchData() {
          try {
            const res = await axios.get(`http://localhost:8081/favor/${user.id}`);
            if (res.status === 200) {
              setData(res.data);
              console.log(res.data);
              setLoading(false);
            }
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        }
      
        // Pass a function reference to setInterval, don't invoke it immediately
        const interval = setInterval(fetchData, 3000);
      
        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
      }, []);
      

    //favorite clicks
  const isProductFavorite = (productId) => {
    return (
      favorites &&
      favorites.some((favorite) => favorite.product_id === productId)
    );
    // return favorites && favorites.includes(productId);
  };

  const handleFavorite = async (productId) => {
    if (!user) {
      toast.error("log in to add favorites", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    } else {
      try {
        await axios.post("http://localhost:8081/addfav", {
          userId: user.id,
          productId,
        });
        setFavorites((prevFavorites) => [...prevFavorites, productId]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUnFavorite = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8081/delfav/${user.id}/${productId}`
      );
      setFavorites((prevFavorites) =>
        prevFavorites.filter((id) => id !== productId)
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await axios.get(
          `http://localhost:8081/favorites/${user.id}`
        );
        if (res.status === 200) {
          setFavorites(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFavorites();
  }, [favorites]);

    return (
        <div className='bg-white w-full h-full'>
            <Navbar />
            <div className='m-2 mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
            <h2 className="">Favourites</h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {data.map((product) => (
                  <div key={product.id} className="p-2 rounded-2xl hover:bg-blue-500 border-2 border-blue-600">
                    <Link
                      to={`./eachprodpage/${product.id}`}
                      className="group no-underline"
                    >
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                        <div>
                          <img
                            src={product.image1}
                            alt={product.imageAlt}
                            className="h-full w-full object-cover object-center group-hover:opacity-75"
                          />
                        </div>
                      </div>
                      <h3 className="mt-4 text-sm text-gray-700">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        ₹{product.price}
                      </p>
                    </Link>
                    <div className=" flex justify-between">
                      <p className="text-md font-medium text-gray-600">
                        {product.location}
                      </p>
                      {isProductFavorite(product.id) ? (
                        <div>
                          <button
                            onClick={() => {
                              handleUnFavorite(product.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 512 512"
                            >
                              <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={() => {
                              handleFavorite(product.id);
                            }}
                            className="hover scale-110 transition ease-out duration-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 512 512"
                            >
                              <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Favourites;