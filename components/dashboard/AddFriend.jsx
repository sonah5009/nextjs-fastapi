import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddFriend = () => {
  const [friendname, setFriendname] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    try {
      const userKey = localStorage.getItem("user_key"); // Assuming the user_key is stored after login
      const response = await axios.post(
        "http://localhost:8000/addfriend",
        {
          friend_name: friendname,
          user_key: userKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            user_key: userKey,
          },
        }
      );
      console.log(response.data);

      router.push("/dashboard/friendlist");
      // 성공 처리 로직
    } catch (error) {
      alert(error);
      console.error(error);
      // 실패 처리 로직
    }
  };
  return (
    <div className="flex-col mt-3 flex-center">
      <form className="p-6 bg-white rounded shadow-md" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="friendname"
            className="block text-sm font-medium text-gray-700">
            Friendname
          </label>
          <input
            type="text"
            id="friendname"
            value={friendname}
            onChange={(e) => setFriendname(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 text-black rounded-md bg-primary-yellow hover:bg-yellow-400">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFriend;
