import { io } from "socket.io-client";

let socket = null;
export const socketEvents = {
     notification:"notification",
     message:"message",
     statusChange:"status-changes"
}
export function initSocket(token) {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ["websocket"],   // production recommended
      reconnection: true,
    });
  }
  console.log("Socket initialized...")
  return socket;
}

export function getSocket() {
  return socket;
}
