const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  type: {
    type: String,
    trim: true,
    required: "Exercise type is required",
    validate: {
      validator: function(v) {
        if(v.toLowerCase() === "resistance" || v.toLowerCase() === "cardio")
          return true;
      },
      message: type => `Exercise Type must be set to either 'resistance' or 'cardio'`
    }
  },
  
  name: {
    type: String,
    trim: true,
    required: "Exercise name is required"
  },

  duration: {
    type: Number,
    required: "Exercise duration is required",
    min: [0, 'Must be greater than 0']
  }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
