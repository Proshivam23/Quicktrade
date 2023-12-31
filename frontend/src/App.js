import "./App.css";
import Login from "./Authentication/Login";
import Navbar from "./Navbar";
import Navbar2 from "./Navbar2";
import OtpInput from "./Authentication/Otpinput";
import Signup from "./Authentication/Signup";
import { Routes, Route, BrowserRouter, Switch } from "react-router-dom";
import Home from "./Home/Home";
import Forgot from "./Authentication/Forgot";
import Newpassword from "./Authentication/Newpassword";
import FotpInput from "./Authentication/Fotpinput";
import AddProfilePic from "./Add/AddProfilePic";
import AddProduct from "./Add/AddProduct";
import { UserProvider } from "./UserContext";
import Admin from "./dashboard/Admin";
import Test from "./Test";
import Chat from "./Chat";
import EachProdPage from "./ProdPage/EachPodPage";
import { CookiesProvider } from "react-cookie";
import ListedItems from "./Listed/ListedItems";
import ProfilePage from "./Profile/ProfilePage";
import Purchases from "./Purchases/Purchases";
import UserReviews from "./Reviews/UserReviews";
import Map from "./Map";
import SellerReview from "./components/SellerReview";
import Favour from './Favorites'

// import Buy from "./Buy";
import Buy from "./Buy";
// import Chat from "./Chat";
import Chat2 from "./Chat2";

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route excat path="/" element={<Navbar />} />
    <Route excat path="/chat" element={<Navbar2 />} />
    <Route path="/Home/eachprodpage/:prodid" element={<Navbar2 />} />
    <Route path="/user-review" element={<Navbar2 />} />
    {/* <Route path="/Signup" element={<Navbar />} /> */}
    </Routes>
      {/* <Navbar></Navbar> */}
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <Routes>
          <Route excat path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Otpinput" element={<OtpInput />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Forgot" element={<Forgot />} />
          <Route path="/Newpassword" element={<Newpassword />} />
          <Route path="/Fotpinput" element={<FotpInput />} />
          <Route path="/Pfp" element={<AddProfilePic />} />
          <Route path="/Addproduct" element={<AddProduct />} />
          <Route path="/dashboard" element={<Admin />} />
          <Route path="/test" element={<Test />} />
          {/* <Route path="/chat" element={<Chat />} /> */}
          <Route path="/home/eachprodpage/:prodid" element={<EachProdPage />} />
          <Route path="/listed" element={<ListedItems />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/purchase" element={<Purchases />} />
          <Route path="/user-review" element={<UserReviews />} />
          <Route path="/chat2" element={<Chat2/>}/>
          <Route path="/chat" element={<Chat />} />
          <Route path="/buy" element={<Buy/>}/>
          <Route path="/map" element={<Map/>} />
          <Route path="/sr" element={<SellerReview/>} />
          <Route path="/Favourites" element={<Favour/>} />

        </Routes>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
