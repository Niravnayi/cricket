import axios from "axios";
import Cookies from "js-cookie";

const cookie = Cookies.get("authToken");

const axiosClient = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cookie}`,
  },
});


export default axiosClient;