// app/chat/[roomKey]/page.jsx
// TODO: replyKey messageKey 가져오는 함수 제작
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { GoPaperclip } from "react-icons/go";
import Photo from "@/components/chat/Photo";
import PhotoBtn from "@/components/chat/PhotoBtn";
import VideoBtn from "@/components/chat/VideoBtn";
import Video from "@/components/chat/Video";

const ChatPage = () => {
  const [currentUserKey, setCurrentUserKey] = useState(null);
  const [messages, setMessages] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const backgroundLeftRef = useRef(null);
  const [replyKey, setReplyKey] = useState(null);
  const [contentPath, setContentPath] = useState(null); // video or image path
  const [messageKey, setMessageKey] = useState(null); // video or image path

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
    // chat 창에 text 나 photo, video 띄워야 댐.
    try {
      const response = await axios.get("http://localhost:8000/messages-all", {
        params: { room_key: roomKey },
      });
      setMessages(response.data);
      console.log(response.data.message_key);
      // setMessageKey(response.data)
      // [{'user_key': msg[3], 'username': msg[9], "message": msg[1],
      // "time_stamp": msg[4], "reply_key": msg[5], "message_type": msg[6],
      // "message_key": msg[0]} for msg in messages]
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error("Error fetching messages text:", error);
    }
    // }, [roomKey]); // Add roomKey as a dependency
  }, [roomKey, scrollToBottom]); // Add roomKey as a dependency

  // send button
  const sendBtn = useCallback(
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
          reply_key: replyKey,
          message_type: 0,
          content_path: contentPath,
        });
        setInputMessage("");
        await fetchMessages();
        setTimeout(scrollToBottom, 0);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [
      inputMessage,
      roomKey,
      replyKey,
      contentPath,
      fetchMessages,
      scrollToBottom,
    ]
  );
  // send button: 엔터 키 사용 가능
  const handleKeyDown = (event) => {
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault();
      sendBtn(event);
    }
  };

  const sendPhoto = useCallback(
    async (e) => {
      try {
        const userKey = localStorage.getItem("user_key");
        setCurrentUserKey(userKey);
        await axios.post("http://localhost:8000/upload-photo", {
          message: null,
          user_key: userKey,
          room_key: roomKey,
          reply_key: replyKey,
          message_type: 1,
          content_path: contentPath,
        });
        await fetchMessages();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [roomKey, replyKey, contentPath, fetchMessages, scrollToBottom]
  );
  // vedio button

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

  const formatMessageWithBr = (message) => {
    return { __html: message.replace(/\n/g, "<br>") };
  };
  return (
    // Render chat room content
    <div className="flex flex-col w-full h-full bg-primary-skyblue">
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
                  {/* 왼쪽 상대방 챗 */}
                  {message.user_key != currentUserKey ? (
                    <div className="left-container">
                      <div className="left-id"> {message.username}</div>

                      {message.message_type == 0 ? (
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
                      ) : (
                        // <div>{message.message_type}</div>
                        <div>
                          {message.message_type == 1 ? (
                            // <div>images</div>
                            <Photo />
                          ) : (
                            <div>videos</div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    // 오른쪽 내 챗
                    <div className="chat-container line-right">
                      <div className="time-box-right">
                        {convertToReadableTime(message.time_stamp)}
                      </div>
                      {message.message_type == 1 ? (
                        <div
                          className="break-words user-chat-box w-fit max-w-[200px] overflow-wrap color-yellow"
                          dangerouslySetInnerHTML={formatMessageWithBr(
                            message.message
                          )}
                        />
                      ) : (
                        <div>
                          {message.message_type == 1 ? (
                            // <div>images</div>
                            <Photo />
                          ) : (
                            // <Video />
                            <Photo />
                          )}
                        </div>
                      )}
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
            <div className="flex flex-row justify-between w-full">
              <button className="pl-3 text-slate-800/40 flex-center hover:text-gray-700">
                <VideoBtn />
              </button>
              <button
                className="pl-3 text-slate-800/40 flex-center hover:text-gray-700"
                onSubmit={sendPhoto}>
                {/* <PhotoBtn roomKey={roomKey} /> */}
                PhotoBtn
              </button>
              <button
                type="submit"
                className="send-box"
                id="btn_send"
                onSubmit={sendBtn}>
                Send
              </button>
            </div>

            <div className="mb-2" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
