import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import {useNavigate} from "react-router-dom";
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
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

const ListedItems = () => {
  const navigate = useNavigate();
  const [listedItems, setListedItems] = useState([]);
  const [cookies,setCookies,removeCookies] = useCookies(["user"]);
  const user = cookies.user || null;
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  useEffect(() => {
    const fetchListedItems = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/listed/${user.id}`);
        if (res.status === 200) {
          setListedItems(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchListedItems();
  }, []);

  //handle delete
  const handleDelete = async (itemId) => {
    try {
      const res = await axios.post(`http://localhost:8081/delete-products/${itemId}`);
      if(res.status===200){
        toast.success("Deleted product successfully", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
          setListedItems((prevProducts) =>
          prevProducts.filter((product) => product.product_id !== itemId)
        );
          setOpen(!open);
      }
     
    } catch (error) {
      console.log(error);
    }
  };

  //handle log out 
  const handleLogOut = () => {
    removeCookies("user",[{path:"/",domain:"localhost"}]);
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
              Listed Items
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
              Profile
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <Cog6ToothIcon className="h-5 w-5" />
              </ListItemPrefix>
              Settings
            </ListItem>
            <ListItem>
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Button onClick={handleLogOut} color="red">Log Out</Button>
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
                <p className="mt-1 text-lg font-medium text-gray-900">
                  ₹{product.price}
                </p>
                {product.truefalse === 1 ? (
                  <Button  variant="gradiant" className="m-0">
                    Sold
                  </Button>
                ) : (
                  <Button onClick={handleOpen} variant="gradiant" className="m-0">
                    {product.active ===1 ? "Unlist" : "re-list"}
                  </Button>
                )}
                <Dialog open={open} handler={handleOpen}>
                  <DialogHeader>Are you sure?</DialogHeader>
                  <DialogBody>
                    <p>Do you really want to delete?</p>
                  </DialogBody>
                  <DialogFooter>
                    <Button
                      variant="text"
                      color="blue-gray"
                      onClick={handleOpen}
                      className="mr-1"
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button
                      variant="gradient"
                      color="red"
                      onClick={() =>handleDelete(product.product_id) }
                    >
                      <span>Confirm</span>
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

export default ListedItems;
