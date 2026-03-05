let express=require("express");
let http=require("http");
let {Server}=require("socket.io");
let path=require("path");
let app=express();
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"dist_1")));
app.get("/", (req, res) => {
    res.render("index");
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
server.listen(3000,()=>{
    console.log("server is running");
})