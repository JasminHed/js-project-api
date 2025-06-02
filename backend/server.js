import cors from "cors";
import express from "express";
import listEndpoints from "express-list-endpoints";
import data from "./data.json" with { type: "json" };
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//from codealong w. Jennie importing mongoose and mongodb database
//const mongoURL = process.env.MONGO_URL || "mongodb+srv://jasminhedlund:j69fsyDYPNMORPC9@cluster0.7cnipth.mongodb.net/animals?retryWrites=true&w=majority&appName=Cluster0"
//mongoose.connect (mongoURL, {useNewURLParser: true, useUnifiedTopology: true})
//mongoose.Promise = Promise

//NEW, this can be changed
//const Animal = mongoose.model("Animal", {
 // name: String,
  //age: Number,
  //isFurry: Boolean

//})

//to not get repeat of each animal or thought
//Animal.deletemany().then(() => {
//data
//newAnima({name: "Alfons", age: 2, isFurry: true }).save()
//newAnima({name: "Lucy", age: 4, isFurry: false }).save()
//newAnima({name: "hugo", age: 3, isFurry: true }).save()
//})

//write endpoint for animal or other here

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

  console.log ("What hearts gives", hearts)
  console.log ("Type of hearts", typeof hearts)
  
  let filteredMessages = data;
  
  // Optional: filter by minimum hearts
  if (hearts) {
    const minHearts = parseInt(hearts); //beacuse it is a number
    if (!isNaN(minHearts)) {
      filteredMessages = filteredMessages.filter(message => message.hearts >= 5);
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


//create model for mongo database - validation + error handling on post request
const Person = mongoose.model("Person", {
name: {
  type: String,
  required: true,
  minlength: 2,
  maxlength: 500,

},
height: {
type: Number,
required: true,
min: 5,
},

birthdate: {
type: Date,
default: Date.now
}
})

new Person ({name: "Van", height: 150}).save()

//Endpint for this
app.post ("/people", async (req, res)=> {
  const erson = new Person (req.body) //create a person w. req.body using our model above. automatically validate when saving. 
  const savedPerson = await person.save() //sense async function, we await results. Store results in savedPerson
  res.join(savedPerson) //here we send the results back to the client

  // for error, use status.json and then the code (404) or whatever works. 
})