// import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (!res.socket.server.io) {
    const ioServer = new Server(res.socket.server);
    res.socket.server.io = ioServer;
  }

  const { io } = res.socket.server;

  io.on("connection", (socket) => {
    socket.on("join-room", (room) => {
      socket.join(room);
      const players = io.sockets.adapter.rooms.get(room);
      socket.to(room).emit("players-in-room", players ? players.size : 0);
    });

    socket.on("position-change", ({ position, user, room }) => {
      console.log("position-change:", { position, user, room });
      socket.to(room).emit("position-change", { position, user });
    });
  });
  res.end();
}
