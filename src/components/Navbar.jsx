import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logo } from "../assets/images";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve login status from localStorage
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedInStatus === "true");

    // Redirect to dashboard if already logged in
    if (loggedInStatus === "true" && window.location.pathname === "/contact") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username"); // Ensure username is also removed
    setIsLoggedIn(false);
    navigate("/contact"); // Redirect to login page on logout
  };

  return (
    <header className='header'>
      <nav className='flex items-center justify-between text-lg gap-7 font-medium'>
        <NavLink to='/' className='flex items-center'>
          <img src={logo} alt='Logo' className='h-10' />
        </NavLink>

        <div className='flex flex-grow items-center justify-center gap-7'>
          <NavLink to='/about' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            About
          </NavLink>
          <NavLink to='/science' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            Science
          </NavLink>
          <NavLink to='/technology' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            Technology
          </NavLink>
          <NavLink to='/engineering' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            Engineering
          </NavLink>
          <NavLink to='/arts' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            Arts
          </NavLink>
          <NavLink to='/maths' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            Maths
          </NavLink>
          {isLoggedIn && (
            <NavLink to='/dashboard' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
              Dashboard
            </NavLink>
          )}
          <NavLink to='/introduction-cards' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
            Intros
          </NavLink>
        </div>

        <div className='flex gap-4'>
          {!isLoggedIn ? (
            <NavLink to='/contact' className='text-white bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-600'>
              Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className='text-white bg-red-500 px-4 py-2 rounded-md shadow-md hover:bg-red-600'
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
