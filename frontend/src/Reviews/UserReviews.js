import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Card, Typography, Button, Rating } from "@material-tailwind/react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
const UserReviews = () => {
  const [cookies] = useCookies(["user"]);
  const user = cookies.user || null;
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  useEffect(() => {
    // Fetch the user's reviews using Axios
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/user-reviews/${user.id}`
        );
        if (response.status === 200) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    };

    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const handleDeleteReview = async (review_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/delete-review/${review_id}`
      );
      if (response.status === 200) {
        // Remove the deleted review from the state
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== review_id)
        );
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  return (<div className="w-screen h-screen">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4 ">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4 hover:scale-105 transition ease-out duration-200">
          <div className="mb-2">
            <img
              src={review.pic} // Replace with the actual profile picture URL
              alt="Seller's Profile Pic"
              className="w-16 h-16 rounded-full"
            />
          </div>
          <div className="mb-2">
            <Typography variant="h6">Seller: {review.name}</Typography>
          </div>
          <div className="mb-2">
            {/* <Typography variant="subtitle">Rating: {review.rating}</Typography> */}
            <Rating value={review.rating} readonly />
          </div>
          <div className="mb-2">
            <Typography variant="body">Review: {review.content}</Typography>
          </div>
          <div className="mb-2">
            <Typography variant="caption">
              Review Date: {review.date}
            </Typography>
          </div>
          {/* <Button color="red" onClick={() => handleDeleteReview(review.review_id)}>
            Delete
          </Button> */}
          <Button onClick={handleOpen} variant="gradiant" className="m-0">
            Delete
          </Button>
          <Dialog open={open} handler={handleOpen}>
            <DialogHeader>Are you sure?</DialogHeader>
            <DialogBody>
              <p>Do you really want to delete?</p>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={handleOpen}
                className="mr-1"
              >
                <span>Cancel</span>
              </Button>
              <Button
                variant="gradient"
                color="green"
                onClick={() => handleDeleteReview(review.id)}
              >
                <span>Confirm</span>
              </Button>
            </DialogFooter>
          </Dialog>
        </Card>
      ))}
    </div>
    </div>
  );
};

export default UserReviews;
