import mongoose from "mongoose";

const thoughtSchema = new mongoose.Schema({
  message: {
  type: String, //user input
  required: true, //must exist
  minlength: 4,
  maxlength: 140
},
  hearts: { //like count
    type: Number,
    default: 0
  },
  //new, should i have this?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    //required: true //not required to see what user creates what
  },
  createdAt: { //creation timestamp
    type: Date,
    default: Date.now // automatic timestamp
  }
})

const Thought = mongoose.model("Thought", thoughtSchema)

export default Thought;