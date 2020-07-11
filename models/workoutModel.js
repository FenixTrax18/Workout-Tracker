const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ExerciseModel = require("./exerciseModel.js");

const opts = { toJSON: { virtuals: true } };

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },

  exercises: {
    type: [ExerciseModel.schema]
  }
}, opts);

WorkoutSchema.virtual('totalDuration').get(function () {
  //sum of totalDuration
  let tdSum = 0;
  for (let i = 0; i < this.exercises.length; i++) {
    tdSum = tdSum + this.exercises[i].duration;
  }
  return tdSum;
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;