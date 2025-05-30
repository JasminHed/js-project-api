import cors from "cors";
import express from "express";
import listEndpoints from "express-list-endpoints";
import data from "./data.json";

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Documentation endpoint
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({
    message: "Welcome to the Happy Thoughts API",
    endpoints: endpoints
  });
});

// Collection endpoint - returns all messages 
app.get("/messages", (req, res) => {
  const { hearts } = req.query;
  
  let filteredMessages = data;
  
  // Optional: filter by minimum hearts
  if (hearts) {
    console.log("Entering hearts filter"); 
    const minHearts = parseInt(hearts); //beacuse it is a number
    console.log("minHearts:", minHearts);
    if (!isNaN(minHearts)) {
      filteredMessages = filteredMessages.filter(message => message.hearts >= minHearts);
    }
  }
  
  res.json(filteredMessages);
});

// Single item endpoint - returns one specific message
app.get("/messages/:id", (req, res) => {
  const message = data.find(item => item._id === req.params.id);
  
  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }
  
  res.json(message);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
