import { useEffect, useState } from "react";
import IOServer from "socket.io-client";

interface IuseSocket {
  onPlayerPositionChange: Function;
}

export const useSocket = ({ onPlayerPositionChange }: IuseSocket) => {
  const [socket] = useState(() => IOServer());

  useEffect(() => {
    console.log("Initializing socket...");
    const socketInitializer = async () => {
      await fetch("/api/socket");

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("players-in-room", (playersInRoom) => {
        console.log("players-in-room:", playersInRoom);
      });

      socket.on("position-change", ({ position, user }) => {
        // console.log("position-change:", { position, user });
        onPlayerPositionChange({ position, user });
      });
    };

    socketInitializer();
    // }
  }, []);

  const changePlayerPosition = ({ position, user, room }) => {
    socket.emit("position-change", { position, user, room });
  };

  const joinRoom = (room) => {
    socket.emit("join-room", room);
  };

  return {
    changePlayerPosition,
    joinRoom,
  };
};
