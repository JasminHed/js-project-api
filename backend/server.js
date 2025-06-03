import cors from "cors";
import dotenv from "dotenv"
import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose"

//import data from "./data.json"

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl)

const thoughtSchema = new mongoose.Schema({
  message: String,
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model("Thought", thoughtSchema)

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

app.get("/messages", async (req, res) => {
  const { hearts } = req.query;
  
  try {
    let query = {};
    if (hearts) {
      const minHearts = parseInt(hearts);
      if (!isNaN(minHearts)) {
        query.hearts = { $gte: minHearts };
      }
    }
    
    const filteredMessages = await Thought.find(query);
    res.json(filteredMessages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get("/messages/:id", async (req, res) => {
  try {
    const message = await Thought.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Message not found" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




