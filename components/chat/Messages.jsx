// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const Messages = ({ room_key: roomKey }) => {
//   const router = useRouter();
//   const [messages, setMessages] = useState(null);
//   const userKey = localStorage.getItem("user_key"); // Current user's key

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/messages", {
//           params: { room_key: roomKey },
//         });
//         setMessages(response.data); // Assuming the response data is the array of messages
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//         // Handle error appropriately
//       }
//     };

//     fetchMessages();
//   }, [roomKey]);

//   const [inputMessage, setInputMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     if (!inputMessage.trim()) return; // Prevent empty messages

//     try {
//       // Replace with the actual URL and adjust parameters as needed
//       await axios.post("http://localhost:8000/insert-message", {
//         message: inputMessage,
//         user_key: userKey,
//         room_key: roomKey,
//       });
//       setInputMessage(""); // Clear the textarea after sending
//     } catch (error) {
//       console.error("Error sending message:", error);
//       // Handle error appropriately
//     }
//     // router.refresh();
//   };

//   return (
//     <div>
//       <div>Current User Key: {userKey}</div>
//       <div>
//         Messages:
//         {messages && messages.length > 0 ? (
//           <ul>
//             {messages.map((message, index) => (
//               <li key={index}>
//                 {message.user_key !== userKey ? (
//                   <>
//                     {message.username}: {message.message} - {message.time_stamp}
//                   </>
//                 ) : (
//                   <>
//                     {message.message} - {message.time_stamp}
//                   </>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div>No messages found.</div>
//         )}
//       </div>
//       <div className="border border-gray-200 rounded-lg">
//         {/* Other components */}
//         <form
//           className="w-118 h-47.5 bg-white rounded-b-lg flex flex-col items-end p-4"
//           onSubmit={handleSubmit}>
//           <textarea
//             className="w-full border-none outline-none resize-none"
//             name="text"
//             id="message"
//             cols="50"
//             rows="10"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}></textarea>
//           <button
//             type="submit"
//             className="mr-2.5 bg-yellow-400 rounded-md border-none text-lg font-noto-sans font-normal text-center p-1.5"
//             id="btn_send">
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Messages;
