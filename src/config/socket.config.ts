import { io } from "socket.io-client";
import { baseURL } from "./network.config";

let socket = null;
export const socketEvents = {
     notification:"notification:new",
     message:"message",
     statusChange:"status-changes"
}
export function initSocket({token,userId}) {
  if (!socket) {
    socket = io(baseURL, {
      auth: { token },
      transports: ["websocket"],   // production recommended
      reconnection: true,
      query:{userId}
    });
  }
  console.log("Socket initialized...")
  return socket;
}

export function getSocket() {
  return socket;
}
