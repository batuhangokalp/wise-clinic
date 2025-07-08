import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
  transports: ["websocket"],
  debug: true,
});

export default socket;
