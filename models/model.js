const mongoose = require("mongoose");
const extend = require("mongoose-schema-extend");


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

},
{
  disciminatorKey: 'type'
});

const resistenceSchema = ExerciseSchema.extend({
  weight:{
    type: Number,
    required: "Exercise weight is required",
    min: [0, 'Must be greater than 0']
  },
  reps: {
    type: Number,
    required: "Exercise reps is required",
    min: [0, 'Must be greater than 0']
  },
  sets: {
    type: Number,
    required: "Exercise sets is required",
    min: [0, 'Must be greater than 0']
  }
});

const cardioSchema = ExerciseSchema.extend({
  distance: {
    type: Number,
    required: "Exercise distance is required",
    min: [0, 'Must be greater than 0']
  }
})

const Exercise = mongoose.model("Exercise", ExerciseSchema);

const Resistence = mongoose.model("Resistence", resistenceSchema);

const Cardio = mongoose.model("Cardio", cardioSchema);


const WorkoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },

  exercises: {
    type: [ExerciseSchema]
  }
});

workoutSchema.virtual('totalDuration').get(function () {
  //sum of totalDuration
  let tdSum = 0;
  for (let i = 0; i < this.exercises.length; i++) {
    tdSum = tdSum + this.exercises[i].duration;
  }
  return tdSum;
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Exercise;
module.exports = Resistence;
module.exports = Cardio;
module.exports = Workout;

