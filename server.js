const express = require("express");
const mongojs = require("mongojs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const Model = require("./models/workoutModel.js");
const { CLIENT_RENEG_LIMIT } = require("tls");


const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dbExample", { useNewUrlParser: true });

const databaseUrl = "fitnessTracker";
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

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
  db.workouts.find({}, (error, data) => {
    
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
    });
});

//API route to add new workout and send it (new workouts have no exercises and the "day" field is set to the current time)
app.post("/api/workouts", (req, res) => {
  console.log("Find Me: " + req.body);
    Model.create(req.body)
    .then(data => {
      console.log(data);
      db.workouts.insert(data, (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      });
    })
    .catch(err => {
      res.json(err);
    });
});

//API route to append request body to exercise array then send updated workout
app.put("/api/workouts/:id", (req, res) => {
  var params = req.params;
  db.workouts.update(
    {
      _id: mongojs.ObjectId(params.id)
    },
    {
      $push: { exercises: req.body }
    },
    (error, edited) => {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        console.log(edited);
        res.send(edited);
      }
    }
  );
});

//API route for sending array of 7 most recent workouts
app.get("/api/workouts/range", (req, res) => {
  //TODO - fix TypeError: db.workouts.find(...).limit(...).sort(...).then is not a function
  db.workouts.find({})
  .limit(7)
  .sort({ date: -1 })
  .then(dbFitness => {
    res.json(dbFitness);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

app.listen(3000, () => {
  console.log("App running on port 3000!");
});
