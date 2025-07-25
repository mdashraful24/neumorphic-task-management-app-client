import alt from '../../../assets/auth/profile.png';
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import DarkMode from '../DarkMode/DarkMode';

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close the profile dropdown when the user changes
    useEffect(() => {
        setProfileDropdownOpen(false);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSignOut = () => {
        logOut()
            .then(() => {
                toast.success("User signed out successfully", {
                    position: "top-right",
                });
                navigate("/");
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    // Scroll to Home Section
    const scrollToHome = () => {
        navigate("/");
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const links = (
        <>
            <ul className='btn btn-sm'>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                    Login
                </NavLink>
            </ul>
        </>
    );

    return (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-800 to-blue-800 shadow-lg px-1">
            <div className="navbar container mx-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost hidden pl-0"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        {menuOpen && (
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                                onClick={() => setMenuOpen(false)}
                            >
                                {links}
                            </ul>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={scrollToHome}
                            className="flex items-center gap-2"
                        >
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">ProTasker</h2>
                        </button>
                    </div>
                </div>
                <div className="navbar-end">
                    {user ? (
                        <div className="relative dropdown-container" ref={profileDropdownRef}>
                            <img
                                className="rounded-full w-10 h-10 object-cover cursor-pointer hover:bg-gray-300 p-1"
                                src={user?.photoURL || alt}
                                alt="User profile"
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            />
                            {profileDropdownOpen && (
                                <div className="absolute -right-2 mt-2 w-36 shadow-lg z-10 bg-base-200 rounded-lg">
                                    <div className="py-2 px-3 text-center">
                                        <p className="font-semibold text-sm cursor-not-allowed">
                                            {user?.displayName || "User"}
                                        </p>
                                    </div>
                                    <ul className="dropdown-menu text-center">
                                        <li>
                                            <button
                                                className="block w-full py-2 rounded-b-lg hover:text-white hover:font-medium hover:bg-red-700"
                                                onClick={handleSignOut}
                                            >
                                                Log out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        [links]
                    )}
                </div>
                <div>
                    <DarkMode />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
