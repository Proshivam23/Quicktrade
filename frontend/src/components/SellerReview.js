import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rating } from "@material-tailwind/react";
const SellerReview = (id2) => {
  const [reviews, setReviews] = useState([]);
  const id = id2; // Replace this with the actual seller's ID

  useEffect(() => {
    const fetchSellerReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/seller-reviews/${id}`);
        if (response.status === 200) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Error fetching seller reviews:", error);
        // Handle the error, show a message to the user, or perform other actions.
      }
    };

    fetchSellerReviews();
  }, [id])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Seller Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews available for this seller.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="mb-6 border-b-2 border-gray-200 ">
              <div className="flex items-center mb-2">
                <img src={review.pic} alt={review.name} className="w-10 h-10 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{review.name}</h3>
                  <Rating value={review.rating} readonly/>
                </div>
              </div>
              <p className="text-gray-700 ml-14">{review.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerReview;
