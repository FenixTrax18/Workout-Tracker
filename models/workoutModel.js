const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ExerciseModel = require("./exerciseModel.js");

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },

  exercises: {
    type: [ExerciseModel.schema]
  }
});

WorkoutSchema.virtual('totalDuration').get(function () {
  //sum of totalDuration
  console.log(this.exercises);//TODO - fix
  let tdSum = 0;
  for (let i = 0; i < this.exercises.length; i++) {
    tdSum = tdSum + this.exercises[i].duration;
  }
  console.log(tdSum);//TODO - fix
  return tdSum;
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;