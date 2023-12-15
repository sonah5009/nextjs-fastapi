// TODO: 최근 메시지로 표시
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // or the appropriate import based on your routing setup
import { MdPerson } from "react-icons/md";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const router = useRouter();
  const sortChatRooms = () => {
    // 최근 메시지가 위로 올라오도록 재정렬
    // 사용자 이름 및 최근 채팅 표시
    // user key 에 맞는 message_table 합치고
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      const userKey = localStorage.getItem("user_key");
      const response = await axios.get("http://localhost:8000/chat-rooms", {
        params: { user_key: userKey },
      });
      // room_key, room_name 받음
      setChatRooms(response.data);
    };

    fetchChatRooms();
  }, []);
  const handleChatRoomClick = (roomKey) => {
    // Navigate to the specific chat room page
    router.push(`/dashboard/chat/${roomKey}`);
  };
  return (
    <div>
      <div>
        {chatRooms && chatRooms.length > 0 ? (
          <ul>
            {chatRooms.map((room, index) => (
              <li
                key={index}
                onClick={() => handleChatRoomClick(room.room_key)}
                className="flex py-1 hover:bg-surface-dark/20">
                <MdPerson
                  size={40}
                  className="mx-2 text-2xl rounded-md bg-primary-skyblue text-background"
                />
                {room.room_name}
              </li>
            ))}
          </ul>
        ) : (
          <div>No chat rooms found.</div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
