"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MdPerson } from "react-icons/md";

const FriendList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const userKey = parseInt(localStorage.getItem("user_key")); // Get user_key stored in local storage
    const fetchFriends = async () => {
      const response = await axios.get("http://localhost:8000/friends", {
        params: { user_key: userKey },
      });
      const friendKeys = response.data.friend_key;

      // Fetch friend names for each key
      const friendNames = await Promise.all(
        friendKeys.map(async (key) => {
          const res = await axios.get("http://localhost:8000/friend-name", {
            params: { friend_key: key },
          });
          return { key, name: res.data.friend_name };
        })
      );

      setFriends(friendNames);
    };
    fetchFriends();
  }, []);

  const router = useRouter();
  const HandleFriendClick = async (friendKey) => {
    const userKey = parseInt(localStorage.getItem("user_key")); // Get user_key stored in local storage

    try {
      const response = await axios.post(
        "http://localhost:8000/create-or-get-personal-chat-room",
        {
          user_key: userKey,
          friend_key: friendKey,
        }
      );
      const { room_id, room_key, room_name } = response.data;
      router.push(`/dashboard/chat/${room_key}`);
    } catch (error) {
      console.error("Error creating/getting chat room", error.response.data);
      // Handle error
    }
  };
  const myName = friends[0]?.name; // Safely access the first friend's name
  const myNameKey = friends[0]?.key; // Safely access the first friend's name

  return (
    <div>
      <div>
        <ul>
          <li
            className="flex py-1 hover:bg-surface-dark/20"
            onClick={() => HandleFriendClick(myNameKey)}>
            <MdPerson
              size={40}
              className="mx-2 text-2xl rounded-md bg-primary-skyblue text-background"
            />
            {myName}
          </li>
        </ul>
        <ul>
          <br />
          <div className="text-sm font-light ">Friends</div>
          {friends.slice(1)?.map((friend, index) => (
            <li
              key={index}
              className="flex py-1 hover:bg-surface-dark/20"
              onClick={() => HandleFriendClick(friend.key)}>
              <MdPerson
                size={40}
                className="mx-2 text-2xl rounded-md bg-primary-skyblue text-background"
              />
              {friend.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;
