"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation for empty fields or password mismatch
    if (!username || !password || password !== confirmPassword) {
      console.log("Invalid input");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/signup", {
        username: username,
        password: password,
      });

      if (response.data.error) {
        alert(response.data.error); // Display alert if error in response
      } else {
        console.log("Signup successful");
        // alert("Signup successful");
        router.push("/login");
        // Handle successful signup (e.g., redirect to login)
      }
    } catch (error) {
      console.error(error);
      alert("Account already exists");
      // Handle other errors
    }
  };

  return (
    <div className="flex-col h-full my-auto bg-white rounded-lg shadow-2xl flex-center">
      <div className="w-full p-3 mb-4 text-lg font-semibold flex-center bg-primary-yellow">
        <div>{`V(=^･ω･^=)v`}</div>
      </div>
      <div className="py-2 text-4xl font-bold">Sign Up</div>

      <form className="p-6 rounded " onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-md bg-primary-yellow hover:bg-yellow-400">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
