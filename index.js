let express=require("express");
let http=require("http");
let {Server}=require("socket.io");
let io=new Server(http.createServer(express()),{
    cors: {
    origin: "*",
  }
});
let app=express();
app.use("view engine","ejs");
app.use(express.static(path.join(__dirname, "dist")));

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
io.listen(3000,()=>{
    console.log("server is running");
})