import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

const messageHandler = (io, socket) => {
  const createdMessage = (msg) => {
    socket.broadcast.emit("newIncomingMessage", msg);
  };

  socket.on("createdMessage", createdMessage);
};

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
}
