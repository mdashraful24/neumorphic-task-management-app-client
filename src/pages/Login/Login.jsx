import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import { useThemeContext } from "../../providers/ThemeProvider";

const Login = () => {
    window.scrollTo(0, 0);
    const { signIn, setUser } = useAuth();
    const [showPassWord, setShowPassword] = useState(false);
    const [error, setError] = useState({});
    const { theme } = useThemeContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Submit Form
    const onSubmit = async (data) => {
        try {
            const result = await signIn(data.email, data.password);
            const user = result.user;
            setUser(user);

            Swal.fire({
                title: `Welcome"`,
                text: `Hello, ${user?.displayName || user?.email}`,
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
            navigate(from, { replace: true });
        } catch (err) {
            setError({ login: "Please check your email or password." });
            toast.error("Login Failed. Please try again.");
        }
    };

    return (
        <div className={`flex items-center justify-center px-4 pt-8 pb-16 text-black ${theme === "dark"
            ? "bg-gray-900"
            : "bg-gray-100"
                }`}>
            {/* Helmet */}
            <Helmet>
                <title>Sign In | Your App Name</title>
            </Helmet>

            <div className={`bg-gray-100 p-8 rounded-3xl w-full max-w-md ${theme === "dark" 
                ? "shadow-neumorph-2" 
                : "shadow-neumorph"}`}>
                {/* Tabs */}
                <div className="flex justify-between gap-1 mb-6">
                    <button className="flex-1 py-2 mx-1 text-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-soft-neumorph font-semibold">
                        Login
                    </button>
                    <Link
                        to="/signUp"
                        className="flex-1 py-2 mx-1 text-center rounded-xl bg-gray-100 shadow-inset-neumorph font-semibold"
                    >
                        Register
                    </Link>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            {...register("email", { required: "Email is required" })}
                            className="w-full p-3 rounded-xl bg-gray-100 shadow-inset-neumorph focus:outline-none"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type={showPassWord ? "text" : "password"}
                            placeholder="Enter your password"
                            {...register("password", { required: "Password is required" })}
                            className="w-full p-3 rounded-xl bg-gray-100 shadow-inset-neumorph focus:outline-none pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassWord)}
                            className="absolute right-3 top-10 text-gray-500"
                        >
                            {showPassWord ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                        )}
                        {error.login && (
                            <p className="text-xs text-red-500 mt-1">{error.login}</p>
                        )}
                        <div className="text-right mt-1">
                            <a href="#" className="text-xs">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl bg-gray-100 shadow-neumorph hover:shadow-soft-neumorph active:shadow-inset-neumorph transition-all duration-200 font-semibold mb-4"
                    >
                        Sign In
                    </button>
                    <div className="text-center text-xs my-4">Or sign in with</div>
                </form>
                {/* Social Sign-In */}
                <SocialLogin />
            </div>
        </div>
    );
};

export default Login;