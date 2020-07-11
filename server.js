const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitnessTracker", { useNewUrlParser: true });

//HTML route to app index/homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

//HTML route to exercise page
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

//HTML route to stats page
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/stats.html"));
});

//API route to sends array of all workouts
app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});


//API route to add new workout and send it (new workouts have no exercises and the "day" field is set to the current time)
app.post("/api/workouts", (req, res) => {
    db.Workout.create(req.body)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

//API route to append request body to exercise array then send updated workout
app.put("/api/workouts/:id", (req, res) => {
  var params = req.params;
  db.Workout.findOneAndUpdate({ _id: params.id }, { $push: { exercises: req.body }})
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.json(err);
  });
});

//API route for sending array of 7 most recent workouts
app.get("/api/workouts/range", (req, res) => {
  //TODO - fix TypeError: db.workouts.find(...).limit(...).sort(...).then is not a function
  db.Workout.find({})
  .limit(7)
  .sort({ date: -1 })
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.json(err);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
