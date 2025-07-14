import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useThemeContext } from "../../providers/ThemeProvider";

const SignUp = () => {
    window.scrollTo(0, 0);
    const axiosPublic = useAxiosPublic();
    const { setUser, createUser, updateUserProfile } = useAuth();
    const [showPassWord, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();

    // Submit Form
    const onSubmit = (data) => {
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                setUser(loggedUser);
                updateUserProfile(data.name, data.photo);

                // Create user profile in the Firebase/Backend database
                const userInfo = {
                    uid: loggedUser.uid,         // User ID
                    name: data.name,             // Display Name
                    email: data.email,           // Email
                    image: data.photo,           // Photo URL
                    phone: data.phone,           // Phone Number
                    joinedDate: new Date().toISOString(),  // Date user joined
                };

                // Store user details in the database
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        if (res.data.insertedId) {
                            reset(); // Clear the form fields
                            toast.success("Successfully Signed Up");
                            navigate("/");  // Redirect user to home or dashboard
                        }
                    })
                    .catch(error => {
                        toast.error("There was an error storing user details. Please try again.");
                    });
            })
            .catch(error => {
                toast.error("Email has already been used.");
            });
    };

    return (
        <div className={`flex items-center justify-center px-4 pt-8 pb-16 text-black ${theme === "dark"
            ? "bg-gray-900"
            : "bg-gray-100"
            }`}>
            {/* Helmet */}
            <Helmet>
                <title>Sign Up | Bistro Boss Restaurant</title>
            </Helmet>

            <div className={`bg-gray-100 p-8 rounded-3xl w-full max-w-md ${theme === "dark"
                ? "shadow-neumorph-2"
                : "shadow-neumorph"}`}>
                {/* Tabs */}
                <div className="flex justify-between mb-6">
                    <Link to="/login" className="flex-1 py-2 mx-1 text-center rounded-xl bg-gray-100 shadow-inset-neumorph font-semibold">
                        Login
                    </Link>
                    <button className="flex-1 py-2 mx-1 text-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-soft-neumorph font-semibold">
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder="Gittu Khan"
                            className="w-full p-3 rounded-xl bg-gray-100 shadow-inset-neumorph focus:outline-none"
                        />
                        {errors.name && <span className="text-xs text-red-500">Name is required</span>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            placeholder="you@example.com"
                            className="w-full p-3 rounded-xl bg-gray-100 shadow-inset-neumorph focus:outline-none"
                        />
                        {errors.email && <span className="text-xs text-red-500">Email is required</span>}
                    </div>

                    {/* Phone Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            type="tel"
                            {...register("phone", {
                                required: "Phone number is required",
                                validate: {
                                    minLength: (value) =>
                                        value.length >= 6 || "Phone number must be at least 6 digits",
                                    maxLength: (value) =>
                                        value.length <= 11 || "Phone number cannot exceed 11 digits",
                                },
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: "Phone number can only contain digits",
                                },
                            })}
                            placeholder="1234567890"
                            className="w-full p-3 rounded-xl bg-gray-100 shadow-inset-neumorph focus:outline-none"
                        />
                        {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
                    </div>

                    {/* Photo URL */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Photo URL</label>
                        <input
                            type="url"
                            {...register("photo", { required: true })}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full p-3 rounded-xl bg-gray-100 shadow-inset-neumorph focus:outline-none"
                        />
                        {errors.photo && <span className="text-xs text-red-500">Photo URL is required</span>}
                    </div>

                    {/* Password */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type={showPassWord ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                                maxLength: {
                                    value: 20,
                                    message: "Password cannot be more than 20 characters",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                                    message: "Password must contain at least one uppercase, one lowercase, and be at least 6 characters long",
                                }
                            })}
                            placeholder="Strong password"
                            className="w-full p-3 rounded-xl bg-gray-100 shadow-inset-neumorph focus:outline-none pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassWord)}
                            className="absolute right-3 top-10 text-gray-500"
                        >
                            {showPassWord ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: value =>
                                    value === watch('password') || "Passwords do not match"
                            })}
                            placeholder="Confirm password"
                            className="w-full p-3 rounded-xl bg-gray-100 shadow-inset-neumorph focus:outline-none pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-10 text-gray-500"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl bg-gray-100 shadow-neumorph hover:shadow-soft-neumorph active:shadow-inset-neumorph transition-all duration-200 font-semibold"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;