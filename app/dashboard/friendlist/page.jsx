"use client";
import FriendList from "@/components/dashboard/FriendList";
import React, { useState, useEffect } from "react";

const FriendListPage = () => {
  return (
    <div className="px-5 py-4">
      <div className="py-2 font-bold">Friends</div>
      <FriendList />
    </div>
  );
};

export default FriendListPage;
