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
  //TODO
  console.log("Hello");
  db.workouts.find({}, (error, data) => {
    
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
    });
  // .sort({ date: -1 })
  // .then(dbFitness => {
  //   res.json(dbFitness);
  //   console.log("World");
  // })
  // .catch(err => {
  //   res.status(400).json(err);
  // });
  // db.notes.find({}, (error, data) => {
  //   if (error) {
  //     res.send(error);
  //   } else {
  //     res.json(data);
  //   }
  // });
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
  //TODO
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
app.get("/apit/workouts/range", (req, res) => {
  //TODO
  Model.Workout.find({}) //split models into multiple files?
  .limit(7)
  .sort({ date: -1 })
  .then(dbFitness => {
    res.json(dbFitness);
  })
  .catch(err => {
    res.status(400).json(err);
  });
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
