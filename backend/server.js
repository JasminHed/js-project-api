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
  message: {
  type: String, //user input
  required: true, //must exist
  minlength: 4,
  maxlength: 20
},
  hearts: { //like count
    type: Number,
    default: 0
  },
  createdAt: { //creation timestamp
    type: Date,
    default: Date.now // automatic timestamp
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
    res.status(500).json({ error: "Failed to fetch happy thought messages" });
  }
});

app.get("/messages/:id", async (req, res) => {
  try {
    const message = await Thought.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: "Happy thought message not found" });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Happy thought message not found" });
  }
});


app.post("/messages", async (req, res) => {
const { message, hearts } = req.body

try {
  const newMessage = await new Thought ({ message, hearts}) //saved to variabel to use in response
  const savedMessage = await newMessage.save(); 

  res.status (201).json ({
    sucess: true,
    response: newMessage,
    message: "message created successfully"

  })
} catch (error) {
  res.status (500).json ({
    sucess: false,
    response: error,
    message: "happy thought could not be found, please try again"

  })
}
})

app.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await Thought.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      response: deletedMessage,
      message: "Message deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Something went wrong while deleting the message"
    });
  }
});


app.patch("/messages/:id", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const updatedMessage = await Thought.findByIdAndUpdate(
      id,
      { message },
      {
        new: true,
        runValidators: true // ensure it validates the schema
      }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: "Thought not found"
      });
    }

    res.status(200).json({
      success: true,
      response: updatedMessage,
      message: "Updated message successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to update the message"
    });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




