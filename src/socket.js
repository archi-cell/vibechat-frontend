// src/socket.js
import { io } from "socket.io-client";

export const createSocket = (token) => {
    return io("https://vibechat-backend-vf0o.onrender.com", {
        auth: {
            token
        }
    });
};
