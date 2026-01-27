import { io } from "socket.io-client";

export const createSocket = (token) => {
  return io(import.meta.env.VITE_BACKEND_URL, {
    auth: { token },
  });
};
