import axios from 'axios';
// import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// api.interceptors.request.use(
//     (config) => {
//         // if we get a 401 force logout
// if (config.
//         // Cookies.remove('token');

export default api;