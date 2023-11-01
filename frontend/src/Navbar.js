import { Link } from "react-router-dom";

const Navbar = () => {
    return (  
        
        
        <nav className=" sticky top-0 z-50 flex justify-between item-center bg-but shadow-md ">
        <h1 className="text-base p-3 px-4 text-white">QuickTrade</h1>
        <div className="p-3">
            <Link to="/" className="text-decoration-none text-white font-bold">Sign in </Link>
            <Link to="/Signup" className=" mx-5 text-decoration-none text-white font-bold">Sign Up</Link>
            <Link to="/Home" className="mr-5 text-decoration-none text-white font-bold">Home</Link>
        </div>
    </nav>
       
    
    );
}
 
export default Navbar;