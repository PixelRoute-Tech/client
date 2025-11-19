import { getSocket, initSocket, socketEvents } from "@/config/socket.config";
import { useEffect, useState } from "react";

export function useInitSocket(token) {
  useEffect(() => {
    const s = initSocket(token);
    return () => {
      try {
        s.disconnect();
      } catch (e) {}
    };
  }, [token]);
}

export function useSocketListen(eventName: keyof typeof socketEvents) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (payload) => setData(payload);

    socket.on(socketEvents[eventName], handler);

    return () => {
      socket.off(socketEvents[eventName], handler);
    };
  }, [socketEvents[eventName]]);

  return data;
}
