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
  })
  if (user) {
    req.user = user
    next()
  } else {
    res.status(401).json({
      loggedOut: true
    })
  }
}

dotenv.config()

//atlas database from en.vfile if atlas missing go to local database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl) 

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
    response: savedMessage,
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
      sucess: true,
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

// POST Increment hearts by 1
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

//registration endpoint that frontend form will POST to. See Van video. 
app.post("/users", (req, res) => {
  try {
    const { name, email, password } = req.body
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
    res.status(400).json({
      success: false,
      message: "Could not create user",
      errors: error
    })
  }
})

//checks email+password and returns userId if valid, or notfound, true if invalid.
app.post("/sessions", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  })

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.json({ userId: user._id })
  } else {
    res.json({ notFound: true })
  }
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




