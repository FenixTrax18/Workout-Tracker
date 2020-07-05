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
  },

  //specific to resistence type
  weight:{
    type: Number,
    validate: {
      validator: function(v) {

        if (this.type === "resistence" && v > 0){
          return true;
        }

        else if (this.type === "cardio" && v == null){
          return true;
        }

        else {
          return false;
        }
      },
      message: type => `Exercise weight must be greater than 0`
    }
  },

  reps: {
    type: Number,
    validate: {
      validator: function(v) {

        if (this.type === "resistence" && v > 0){
          return true;
        }

        else if (this.type === "cardio" && v == null){
          return true;
        }

        else {
          return false;
        }
      },
      message: type => `Exercise reps must be greater than 0`
    }
  },
  
  sets: {
    type: Number,
    validate: {
      validator: function(v) {

        if (this.type === "resistence" && v > 0){
          return true;
        }

        else if (this.type === "cardio" && v == null){
          return true;
        }

        else {
          return false;
        }
      },
      message: type => `Exercise sets must be greater than 0`
    }
  },

  //specific to cardio type
  distance: {
    type: Number,
    validate: {
      validator: function(v) {

        if (this.type === "cardio" && v > 0){
          return true;
        }

        else if (this.type === "resistence" && v == null){
          return true;
        }

        else {
          return false;
        }
      },
      message: type => `Exercise distance must be greater than 0`
    }
  }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },

  exercises: {
    type: [ExerciseSchema]
  }
});

WorkoutSchema.virtual('totalDuration').get(function () {
  //sum of totalDuration
  let tdSum = 0;
  for (let i = 0; i < this.exercises.length; i++) {
    tdSum = tdSum + this.exercises[i].duration;
  }
  return tdSum;
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Exercise;
module.exports = Workout;


