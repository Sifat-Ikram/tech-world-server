const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4321;


// middleware

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    // credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("tech world is running");
  });
  
  app.listen(port, () => {
    console.log(`tech world server is running through port ${port}`);
  });