import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then((result) => {
                const userInfo = {
                    id: result.user?.uid,
                    email: result.user?.email,
                    name: result.user?.displayName
                };
                toast.success("Successfully Signed In with Google", {
                    position: "top-right",
                });
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        navigate(from, { replace: true });
                    })
                    .catch(error => {
                        console.error("Google Sign-In Error:", error);
                        toast.error(error.message || "Google Sign-In failed.");
                    });
            });
    };

    return (
        <div className="flex justify-center items-center">
            <button
                onClick={handleGoogleSignIn}
                className="w-10 h-10 rounded-full text-2xl flex justify-center items-center bg-[#e0e5ec] shadow-[5px_5px_10px_#bec3c9,-5px_-5px_10px_#ffffff]"
            >
                <FcGoogle />
            </button>
        </div>
    );
};

export default SocialLogin;