import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Create the Socket context
const SocketContext = createContext();

// Create the Socket provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const getID = async () => {
      const id = await AsyncStorage.getItem("currentID");
      setUserId(id);
    };
    getID();
  }, []);

  useEffect(() => {
    const newSocket = io("ws://192.168.0.102:8900"); // Replace with your server URL
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(newSocket.id); // an alphanumeric id...
    });
    // Clean up the socket connection on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    userId && socket.emit("addUser", userId);
    console.log("add");
  }, [userId, socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to use the socket value
export const useSocket = () => {
  return useContext(SocketContext);
};
