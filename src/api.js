import axios from "axios";

const API = axios.create({
    baseURL: "https://vibechat-backend-vf0o.onrender.com",
});

export default API;
