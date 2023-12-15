/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "/api/",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs"
            : "/api/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/openapi.json"
            : "/api/openapi.json",
      },
      {
        source: "/friends",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/friends"
            : "/api/",
      },
      {
        source: "/friend-name",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/friend-name"
            : "/api/",
      },
      {
        source: "/chat-rooms",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/chat-rooms"
            : "/api/",
      },
      {
        source: "/messages",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/messages"
            : "/api/",
      },
      {
        source: "/create-or-get-personal-chat-room",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/create-or-get-personal-chat-room"
            : "/api/",
      },
      {
        source: "/insert-message",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/insert-message"
            : "/api/",
      },
    ];
  },
};

module.exports = nextConfig;
