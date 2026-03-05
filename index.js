const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Serve Vite frontend
app.use(express.static(path.join(__dirname, "dist")));

// Socket.io setup
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("offer", (remoteoffer) => {
    socket.broadcast.emit("offer-arrived", { remoteoffer, socketid: socket.id });
  });

  socket.on("answer", ({ answer, socketid }) => {
    io.to(socketid).emit("answer", answer);
  });

  socket.on("client-ice-candidate", ({ candidate, targetId }) => {
    io.to(targetId).emit("ice-candidates", candidate);
  });
});

// SPA catch-all route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));