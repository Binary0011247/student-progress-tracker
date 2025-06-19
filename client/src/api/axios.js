// api/axios.js
import axios from 'axios';
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api', // Your backend URL
});
export default instance;