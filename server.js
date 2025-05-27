import cors from "cors"
import express from "express"
import listEndpoints from "express-list-endpoints";
import data from "./data.json"; 



// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app)) //returns documentation of API (1st step in req)
})

//by putting messages as endpint we are returning all messages from data.json
app.get("/messages", (req, res)=> { 
  res.json(data)
})

//by adding id the server finds 1 id/message
app.get("/messages/:id", (req, res) => {
  const message = data.find(item => item._id === req.params.id);

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  res.json(message);
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
