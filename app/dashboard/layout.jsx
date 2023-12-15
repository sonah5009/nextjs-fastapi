"use client";
import React from "react";
import Link from "next/link";
import { IoChatbubbleSharp } from "react-icons/io5";
import { MdPerson, MdPersonAddAlt1 } from "react-icons/md";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const handleLogout = () => {
    // Clear user_key from localStorage
    localStorage.removeItem("user_key");

    // Redirect to the home page
    router.push("/");
  };
  return (
    <div className="flex flex-row w-full h-full bg-surface">
      <nav className="flex flex-col items-center justify-start w-2/12 px-2 py-8 space-y-4">
        <Link href="/dashboard/friendlist" className="hover:text-slate-800/40">
          <MdPerson />
        </Link>
        <Link href="/dashboard/chatlist" className="hover:text-slate-800/40">
          <IoChatbubbleSharp />
        </Link>
        <Link href="/dashboard/addfriend" className="hover:text-slate-800/40">
          <MdPersonAddAlt1 />
        </Link>
        <button onClick={handleLogout} className="hover:text-slate-800/40">
          logout
        </button>
      </nav>
      <div className="w-10/12 bg-background">{children}</div>
    </div>
  );
};

export default DashboardLayout;
