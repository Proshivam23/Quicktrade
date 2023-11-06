import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  IconButton,
  Rating,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

const Purchases = () => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const [listedItems, setListedItems] = useState([]);
  const [cookies, setCookies, removeCookies] = useCookies(["user"]);
  const user = cookies.user || null;
  const [openDialogs, setOpenDialogs] = useState({});
  const [currentSellerId, setCurrentSellerId] = useState(null);

  useEffect(() => {
    const fetchListedItems = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/user-purchases/${user.id}`
        );
        if (res.status === 200) {
          setListedItems(res.data);
          const initialOpenDialogs = {};
          res.data.forEach((product) => {
            initialOpenDialogs[product.product_id] = false;
          });
          setOpenDialogs(initialOpenDialogs);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchListedItems();
  }, [user.id]);

  const handleDialogOpen = (productId, sellerId) => {
    setOpenDialogs({
      ...openDialogs,
      [productId]: true,
    });
    setCurrentSellerId(sellerId);
  };

  const handleDialogClose = (productId) => {
    setOpenDialogs({
      ...openDialogs,
      [productId]: false,
    });
    setCurrentSellerId(null);
  };

  const handleComment = async (sellerId, productId) => {
    try {
      const res = await axios.post(
        `http://localhost:8081/add-comment/`,
        { c_t: comment, s_id: sellerId, id: user.id, rating: rating }
      );
      if (res.status === 200) {
        toast.success("Review Added Successfully", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        handleDialogClose(productId); // Close the dialog after adding the review
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const handleLogOut = () => {
    removeCookies("user", [{ path: "/", domain: "localhost" }]);
    navigate("/");
  };

  return (
    <div className="flex">
      <ToastContainer />
      <div className="w-1/4">
        <Card className="h-screen p-4 shadow-xl shadow-blue-gray-900/5">
          <div className="mb-2 p-4">
            <Typography variant="h3" className="underline" color="blue">
              <ShoppingBagIcon className="h-10 2-10" />
              Purchased Items
            </Typography>
          </div>
          <List>
            <ListItem>
              <ListItemPrefix>
                <InboxIcon className="h-5 w-5" />
              </ListItemPrefix>
              Inbox
              <ListItemSuffix>
                <Chip
                  value="14"
                  size="sm"
                  variant="ghost"
                  color="blue-gray"
                  className="rounded-full"
                />
              </ListItemSuffix>
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Link to="/profile" className="no-underline decoration-none">
                Profile
              </Link>
            </ListItem>
            <Link to="/user-review" className="no-underline">
              <ListItem>
                <ListItemPrefix>
                  <Cog6ToothIcon className="h-5 w-5" />
                </ListItemPrefix>
                Added reviews
              </ListItem>
            </Link>

            <ListItem>
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Button onClick={handleLogOut} color="red">
                Log Out
              </Button>
            </ListItem>
          </List>
        </Card>
      </div>
      <div className="w-3/4">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {listedItems.map((product) => (
              <div key={product.product_id}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <div>
                    <img
                      src={product.image1}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
                <p className="mt-0 mb-0 text-lg font-medium text-gray-900">
                  ₹{product.price}
                </p>
                <p className="font-semibold">
                  Seller Name: {product.seller_name}
                </p>
                <p className="mb-0 text-gray-900">Purchase Date:</p>
                <p className="text-gray-400">{product.date}</p>
                <Button
                  onClick={() => handleDialogOpen(product.product_id, product.seller_id)}
                  variant="gradiant"
                  className="m-0"
                >
                  Add Review
                </Button>
                <Dialog open={openDialogs[product.product_id]} handler={handleDialogClose}>
                  <DialogHeader>
                    Add review for the seller:{" "}
                    {currentSellerId
                      ? listedItems.find((item) => item.seller_id === currentSellerId).seller_name
                      : ""}
                  </DialogHeader>

                  <DialogBody>
                    <div className="relative w-[32rem]">
                      <Textarea
                        variant="static"
                        placeholder="Your Comment"
                        rows={8}
                        onChange={handleCommentChange}
                      />
                      <div className="flex w-full justify-between py-1.5">
                        <IconButton variant="text" color="blue-gray" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                            />
                          </svg>
                        </IconButton>
                      </div>
                      <Rating value={rating} name="bar" onChange={(value) => setRating(value)} />
                    </div>
                  </DialogBody>

                  <DialogFooter>
                    <Button
                      variant="text"
                      color="blue-gray"
                      onClick={() => handleDialogClose(product.product_id)}
                      className="mr-1"
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button
                      variant="gradient"
                      color="green"
                      onClick={() => handleComment(currentSellerId, product.product_id)}
                    >
                      <span>ADD</span>
                    </Button>
                  </DialogFooter>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchases;
