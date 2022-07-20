import React, { useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";

var stompClient = null;

export const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        publicChats.push(payloadData);
        setPublicChats([...publicChats]);
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };
  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      console.log(chatMessage);
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };

      if (userData.username !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };
  return (
    <div className="container">
      {userData.connected ? (
        <div className="chat-box">
          <div className="member-list">
            <ul>
              <li
                onClick={() => {
                  setTab("CHATROOM");
                }}
                className={`member ${tab === "CHATROOM" && "active"}`}
              >
                Chatroom
              </li>
              {[...privateChats.keys()].map((name, index) => (
                <li
                  onClick={() => {
                    setTab(name);
                  }}
                  className={`member ${tab === name && "active"}`}
                  key={index}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
          {tab === "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {publicChats.map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.username && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar sm:w-24 md:w-24 lg:w-24">
                        <div class="flex items-center space-x-4 ">
                          <div class="flex-shrink-0 sm:w-11 md:w-8">
                            <img
                              class="w-8 h-8 rounded-full"
                              src="https://robohash.org/99"
                              alt="Neil image"
                            />
                          </div>
                        </div>
                        <p className="leading-loose">{chat.senderName}</p>
                      </div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self sm:w-24 md:w-24 lg:w-24">
                        <div class="flex items-center space-x-4 ">
                          <div class="flex-shrink-0 sm:w-11 md:w-8">
                            <img
                              class="w-8 h-8 rounded-full"
                              src="https://robohash.org/16"
                              alt="Neil image"
                            />
                          </div>
                        </div>
                        <p className="leading-loose">{chat.senderName}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message mt-2">
                <input
                  type="text"
                  className="rounded w-full border-4 border-sky-300 outline-sky-500"
                  placeholder="Nhập nội dung chat ..."
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button
                  type="button"
                  className="bg-sky-600 hover:bg-sky-400 text-white font-bold py-2 px-4 border-sky-500 rounded ml-2 w-40"
                  onClick={sendValue}
                >
                  Gửi
                </button>
              </div>
            </div>
          )}
          {tab !== "CHATROOM" && (
            <div className="chat-content">
              <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.username && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.username && (
                      <div className="avatar sm:w-24 md:w-24 lg:w-24">
                        <div class="flex items-center space-x-4 ">
                          <div class="flex-shrink-0 sm:w-11 md:w-8">
                            <img
                              class="w-8 h-8 rounded-full"
                              src="https://robohash.org/99"
                              alt="Neil image"
                            />
                          </div>
                        </div>
                        <p className="leading-loose">{chat.senderName}</p>
                      </div>
                    )}
                    <div className="message-data">{chat.message}</div>
                    {chat.senderName === userData.username && (
                      <div className="avatar self sm:w-24 md:w-24 lg:w-24">
                        <div class="flex items-center space-x-4 ">
                          <div class="flex-shrink-0 sm:w-11 md:w-8">
                            <img
                              class="w-8 h-8 rounded-full"
                              src="https://robohash.org/16"
                              alt="Neil image"
                            />
                          </div>
                        </div>
                        <p className="leading-loose">{chat.senderName}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="send-message mt-2">
                <input
                  type="text"
                  className="rounded w-full border-4 border-sky-300 outline-sky-500"
                  placeholder="Nhập nội dung chat ..."
                  value={userData.message}
                  onChange={handleMessage}
                />
                <button
                  type="button"
                  className="bg-sky-600 hover:bg-sky-400 text-white font-bold py-2 px-4 border-sky-500 rounded ml-2 w-40"
                  onClick={sendPrivateValue}
                >
                  Gửi
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Nhập vào tên của bạn"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
            margin="normal"
            className="border-4 border-cyan-500 focus:outline-0"
          />
          <button
            className="bg-cyan-600 hover:bg-cyan-400 text-white font-bold py-2 px-4 border-cyan-500 rounded ml-2 "
            onClick={registerUser}
          >
            Button
          </button>
          {/* <button type="button" onClick={registerUser}>
            Vào room
          </button> */}
        </div>
      )}
    </div>
  );
};
