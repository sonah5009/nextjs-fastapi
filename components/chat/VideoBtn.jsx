import React, { useState, useEffect, useCallback } from "react";

const VideoBtn = () => {
  const videoBtn = useCallback(
    async (e) => {
      try {
        const userKey = localStorage.getItem("user_key");
        setCurrentUserKey(userKey);
        await axios.post("http://localhost:8000/insert-message", {
          message: inputMessage,
          user_key: userKey,
          room_key: roomKey,
        });
        await fetchMessages();
        setTimeout(scrollToBottom, 0);
      } catch (error) {
        console.error("Error sending video message:", error);
      }
    }
    // [inputMessage, roomKey, fetchMessages, scrollToBottom]
  );
  return <div>VideoBtn</div>;
};

export default VideoBtn;
