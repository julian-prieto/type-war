"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
// let socket;

const Home = () => {
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");
  const [socket, setSocket] = useState(() => io());
  const [playersInfo, setPlayersInfo] = useState({});

  useEffect(() => {
    // if (joinedRoom) {
    console.log("Initializing socket...");
    const socketInitializer = async () => {
      await fetch("/api/socket");
      // socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("players-in-room", (playersInRoom) => {
        console.log("players-in-room:", playersInRoom);
      });

      socket.on("position-change", ({ position, user }) => {
        console.log("position-change:", { position, user });
        setPlayersInfo({ position, user });
      });
    };

    socketInitializer();
    // }
  }, []);

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    // socket.emit("input-change", e.target.value);
    socket.emit("position-change", { position: e.target.value, user: "custom-01", room: joinedRoom });
  };

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  const handleJoinRoom = () => {
    setJoinedRoom(room);
    socket.emit("join-room", room);
  };

  return (
    <div className="flex flex-col space-y-8">
      <label>
        Room
        <input className="text-black" placeholder="Join room..." value={room} onChange={handleRoomChange} />
        <button onClick={handleJoinRoom}>Join</button>
      </label>
      {joinedRoom && (
        <div>
          <div>ROOM: {joinedRoom}</div>
          <label>
            ChannelOne
            <input
              className="text-black"
              placeholder="Type something"
              value={input}
              onChange={onChangeHandler}
            />
          </label>
          <pre>{JSON.stringify(playersInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;
