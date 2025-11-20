import { getSocket, initSocket, socketEvents } from "@/config/socket.config";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export function useInitSocket() {
  const { user } = useAuth();
  const token = "test";
  useEffect(() => {
    if (user?.id) {
      const s = initSocket({ token, userId: user?.id });
      return () => {
        try {
          s.disconnect();
        } catch (e) {
          console.log(e)
        }
      };
    }
  }, [user]);
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
