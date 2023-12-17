"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import axios from "axios";

const PhotoBtn = ({ roomKey }) => {
  const fetchMessages = useCallback(async () => {
    // chat 창에 text 나 photo, video 띄워야 댐.
    try {
      const response = await axios.get("http://localhost:8000/messages-all", {
        params: { room_key: roomKey },
      });
      setMessages(response.data);
      // [{'user_key': msg[3], 'username': msg[9], "message": msg[1],
      // "time_stamp": msg[4], "reply_key": msg[5], "message_type": msg[6]} for msg in messages]
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error("Error fetching messages text:", error);
    }
    // }, [roomKey]); // Add roomKey as a dependency
  }, [roomKey]); // Add roomKey as a dependency

  return <div>PhotoBtn</div>;
};

export default PhotoBtn;
