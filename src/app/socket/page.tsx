"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
// let socket;

const Home = () => {
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(() => io());

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      // socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("update-input", (msg) => {
        setInput(msg);
      });
    };

    socketInitializer();
  }, []);

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  return (
    <input className="text-black" placeholder="Type something" value={input} onChange={onChangeHandler} />
  );
};

export default Home;
