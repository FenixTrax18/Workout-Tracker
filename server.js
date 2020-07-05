const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");
const Model = require("./models/model.js");


const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const databaseUrl = "fitnessTracker";
const collections = ["exercises"];

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
  //TODO
  Model.Workout.find({}) //split models into multiple files?
  .sort({ date: -1 })
  .then(dbFitness => {
    res.json(dbFitness);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

//API route to add new workout and send it (new workouts have no exercises and the "day" field is set to the current time)
app.post("/api/workouts", (req, res) => {
  //TODO
  console.log(req.body);

  db.notes.insert(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

//API route to append request body to exercise array then send updated workout
app.put("/api/workouts/:id", (req, res) => {
  //TODO
});

//API route for sending array of 7 most recent workouts
app.get("/apit/workouts/range", (req, res) => {
  //TODO
});

//----------------------------------

// app.get("/all", (req, res) => {
//   db.notes.find({}, (error, data) => {
//     if (error) {
//       res.send(error);
//     } else {
//       res.json(data);
//     }
//   });
// });

// app.get("/find/:id", (req, res) => {
//   db.notes.findOne(
//     {
//       _id: mongojs.ObjectId(req.params.id)
//     },
//     (error, data) => {
//       if (error) {
//         res.send(error);
//       } else {
//         res.send(data);
//       }
//     }
//   );
// });

// app.post("/update/:id", (req, res) => {
//   db.notes.update(
//     {
//       _id: mongojs.ObjectId(req.params.id)
//     },
//     {
//       $set: {
//         title: req.body.title,
//         note: req.body.note,
//         modified: Date.now()
//       }
//     },
//     (error, data) => {
//       if (error) {
//         res.send(error);
//       } else {
//         res.send(data);
//       }
//     }
//   );
// });

// app.delete("/delete/:id", (req, res) => {
//   db.notes.remove(
//     {
//       _id: mongojs.ObjectID(req.params.id)
//     },
//     (error, data) => {
//       if (error) {
//         res.send(error);
//       } else {
//         res.send(data);
//       }
//     }
//   );
// });

// app.delete("/clearall", (req, res) => {
//   db.notes.remove({}, (error, response) => {
//     if (error) {
//       res.send(error);
//     } else {
//       res.send(response);
//     }
//   });
// });

app.listen(3000, () => {
  console.log("App running on port 3000!");
});
