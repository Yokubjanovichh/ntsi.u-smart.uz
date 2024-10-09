import { io } from "socket.io-client";
import { MAINURLSOCKET } from "./api/axios";

let socket;

export const connectWebSocket = (token) => {
  socket = io(MAINURLSOCKET, {
    transports: ['websocket'],

    auth: {
      token: `${token}`,
    },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
