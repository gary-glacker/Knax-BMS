 const express = require('express');
 const App = express();
 const db = require("./config/db");
 const cors = require('cors');
 const Port = 4500;

 App.use(cors());
 App.use(express.json());

 //import routers
 const UserRouter = require("./Router/userRouter");

 //assign on the server
 App.use("/api",UserRouter);



 // server
 App.listen(Port, ()=>{
  console.log(`server running https://${Port}`);
 })