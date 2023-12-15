// app/chat/[roomKey]/page.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";

const ChatPage = () => {
  const [currentUserKey, setCurrentUserKey] = useState(null);
  const [messages, setMessages] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const backgroundLeftRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (backgroundLeftRef.current) {
      backgroundLeftRef.current.scrollTop =
        backgroundLeftRef.current.scrollHeight;
    }
  }, []);

  function convertToReadableTime(timestamp) {
    // Extract the time part from the timestamp
    const timePart = timestamp.split(" ")[1];

    // Split the time part into hours, minutes, and seconds
    const [hours, minutes] = timePart.split(":");

    // Convert hours to 12-hour format and determine AM/PM
    const hours12 = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) < 12 ? "오전" : "오후";

    return `${period} ${hours12}:${minutes}`;
  }

  function extractNumericPart(url) {
    const match = url.match(/\d+/); // Regular expression to find continuous digits
    return match ? match[0] : null; // Return the numeric part if found, otherwise null
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const url = `${pathname}?${searchParams}`;
  const roomKey = extractNumericPart(url);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8000/messages", {
        params: { room_key: roomKey },
      });
      setMessages(response.data);
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    // }, [roomKey]); // Add roomKey as a dependency
  }, [roomKey, scrollToBottom]); // Add roomKey as a dependency

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault(); // Prevent default form submission if event exists
      if (!inputMessage.trim()) return; // Prevent empty messages

      try {
        const userKey = localStorage.getItem("user_key");
        setCurrentUserKey(userKey);
        await axios.post("http://localhost:8000/insert-message", {
          message: inputMessage,
          user_key: userKey,
          room_key: roomKey,
        });
        setInputMessage("");
        await fetchMessages();
        setTimeout(scrollToBottom, 0);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [inputMessage, roomKey, fetchMessages, scrollToBottom]
  );
  const handleKeyDown = (event) => {
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  useEffect(() => {
    const userKey = localStorage.getItem("user_key");
    setCurrentUserKey(userKey);
    fetchMessages();

    const messageInput = document.getElementById("message");

    if (messageInput) {
      messageInput.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup the event listener
    return () => {
      if (messageInput) {
        messageInput.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);
  // }, [fetchMessages]);

  const formatMessageWithBr = (message) => {
    return { __html: message.replace(/\n/g, "<br>") };
  };

  return (
    // Render chat room content
    <div className="flex flex-col w-full h-full overflow-scroll bg-primary-skyblue">
      <div className="flex flex-col justify-between h-full ">
        <div className="w-full p-3 font-bold bg-primary-skyblue/90">
          Messages
        </div>
        <div
          className="h-full px-5 overflow-y-scroll"
          id="background-left"
          ref={backgroundLeftRef}>
          {messages && messages.length > 0 ? (
            <ul>
              {messages.map((message, index) => (
                <li key={index}>
                  {message.user_key != currentUserKey ? (
                    <div className="left-container">
                      <div className="left-id"> {message.username}</div>
                      <div className="chat-container">
                        <div
                          className="break-words user-chat-box w-fit max-w-[200px] overflow-wrap color-white"
                          dangerouslySetInnerHTML={formatMessageWithBr(
                            message.message
                          )}></div>
                        <div className="time-box">
                          {convertToReadableTime(message.time_stamp)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="chat-container line-right">
                      <div className="time-box-right">
                        {convertToReadableTime(message.time_stamp)}
                      </div>
                      <div
                        className="break-words user-chat-box w-fit max-w-[200px] overflow-wrap color-yellow"
                        dangerouslySetInnerHTML={formatMessageWithBr(
                          message.message
                        )}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div>No messages found.</div>
          )}
        </div>

        <div className="rounded-t-lg h-[100px]">
          <form className="flex flex-col items-end h-full bg-white rounded-br-sm ">
            <textarea
              className="w-full border-none outline-none resize-none"
              name="text"
              id="message"
              cols="50"
              rows="10"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}></textarea>
            <button
              type="submit"
              className="send-box"
              id="btn_send"
              onSubmit={handleSubmit}>
              Send
            </button>
            <div className="mb-2" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
