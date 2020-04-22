import React, { useState, useEffect } from "react";
import queryString from "query-string";
import socketio from "socket.io-client";

import "./Chat.css";

import InfoBar from "./components/InfoBar/InfoBar";
import Input from "./components/Input/Input";
import Messages from "./components/Messages/Messages";

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    
    const ENDPOINT = "localhost:5000";

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = socketio(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {

        });

        return () => {
            socket.emit("disconnect");

            socket.disconnect();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        console.log("When does this use effect run?");
        socket.on("message", (message) => {
            setMessages(currentMessages => [...currentMessages, message]);
        })
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(""));
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar roomName={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default Chat;
