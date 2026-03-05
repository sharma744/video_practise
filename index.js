let express=require("express");
let http=require("http");
let {Server}=require("socket.io");
let path=require("path");
let app=express();
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});
let server=http.createServer(app)
let io=new Server(server,{
    cors: {
    origin: "*",
  }
});

io.on("connection",(socket)=>{
    socket.on("offer",(remoteoffer)=>{
        socket.broadcast.emit("offer-arrived",{remoteoffer,socketid:socket.id});
    })
    socket.on("answer",({answer,socketid})=>{
       io.to(socketid).emit("answer",answer);
    })
    socket.on("client-ice-candidate",({candidate,targetId})=>{
          io.to(targetId).emit("ice-candidates",candidate);
    })
})
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});