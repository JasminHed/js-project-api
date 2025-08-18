import bcrypt from "bcrypt";
import cors from "cors"
import crypto from "crypto";
import dotenv from "dotenv"
import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose"

import Thought from "./model/Thoughts.js";
import User from "./model/User.js";

//checks if the user is logged in before allowing access to protected routes
const authenticateUser = async (req, res, next) => {
  const user = await User.findOne({
    accessToken: req.header("Authorization")
  });

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "You must be logged in to access this resource",
      loggedOut: true,
    });
  }
};

dotenv.config()

//atlas database from env.file or go to local (?)
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl) 

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors({
  origin: ["https://apifrontback.netlify.app", "http://localhost:5173" ] //allow netlify
}));
app.use(express.json());



// All endpoints 
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({
    message: "Welcome to the Happy Thoughts API",
    endpoints: endpoints
  });
});

//Endpoint for all messages
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

//Endpoint for specific message (id)
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

//POST Endpoint for liking a specific message
app.post("/messages/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMessage = await Thought.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } }, // increase by 1
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      response: updatedMessage,
      message: "Like added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Failed to like the message",
    });
  }
});

//Endpoint registration (body)
app.post("/users", (req, res) => {
  try {
    const { name, email, password } = req.body
    //Hashes the user's password before saving to the database
    const salt = bcrypt.genSaltSync()
    const user = new User({ name, email, password: bcrypt.hashSync(password, salt) })
    user.save()
    res.status(201).json({
      success: true,
      message: "User created",
      id: user._id,
      accessToken: user.accessToken,
    })
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyValue.email) {
        return res.status(400).json({
          success: false,
          message: "That email address already exists"
        });
      }
      if (error.keyValue.name) {
        return res.status(400).json({
          success: false,
          message: "That username already exists"
        });
      }
    }
    res.status(400).json({
      success: false,
      message: "Could not create user",
      errors: error
    });
  }
})

//Endpoint log in (body)
app.post("/sessions", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  })
console.log("user", user)
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.json({ 
      userId: user._id,
      accessToken: user.accessToken
    })
  } else {
    res.json({ notFound: true })
  }
})

//Authorization

//POST Endpoint create a thought
app.post("/messages", authenticateUser, async (req, res) => {
  const { message, hearts } = req.body

  try {
    const newMessage = new Thought({ 
      message, 
      hearts, 
      userId: req.user._id // koppla thought till användaren
    });
    const savedMessage = await newMessage.save(); 

    res.status(201).json ({
      success: true,
      response: savedMessage,
      message: "Message created successfully"
    });
  } catch (error) {
    res.status(500).json ({
      success: false,
      response: error,
      message: "Happy thought could not be saved, please try again"
    });
  }
});


//DELETE Endpoint delete a thought
app.delete("/messages/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Thought.findById(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }


    if (message.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own thoughts" });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      response: message,
      message: "Message deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, response: error, message: "Something went wrong" });
  }
});

//PATCH Endpoint edit or update a thought
app.patch("/messages/:id", authenticateUser, async (req, res) => {
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




