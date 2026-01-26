import axios from "axios";

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000'  // https://task-management-server-opal-xi.vercel.app
})
const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure; 