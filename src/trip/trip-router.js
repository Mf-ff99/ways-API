const express = require("express");
const bcrypt = require("bcryptjs");
const TripService = require("./trip-service");
const { requireAuth } = require("../middleware/jwt-auth");

const tripsRouter = express.Router();

tripsRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    TripService.getTrips(db)
      .then((trips) => {
        return res.json(trips);
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const db = req.app.get("db");
    const { short_description, destination, days, activities, img } = req.body;

    const newTrip = {
      short_description,
      destination,
      days,
      activities,
      img,
    };

    newTrip.user_id = req.user.id;
    const xssTrip = TripService.serializeTrip(trip)
    console.log(req.user.id);
    TripService.insertTrip(db, newTrip)
      .then((trip) => {
        res.status(201).json(xssTrip);
      })
      .catch(next);
  });

tripsRouter.route("/stops/:trip_id").get((req, res, next) => {
  const db = req.app.get("db");
  // get id of trip from params

  const id = req.params.trip_id;

  TripService.getStopsById(db, id)
    .then((stops) => {
      return res.json(stops);
    })
    .catch(next);
});

tripsRouter.route("/stops").post(requireAuth, (req, res, next) => {
  const db = req.app.get("db");
  const { trip_id, longitude, latitude, city, state, stop_name, description, category } = req.body;

  const newStop = { trip_id, longitude, latitude, city, state, stop_name, description, category }
  const xssStop = TripService.serializeStop(newStop)
  // console.log(xssStop)
  TripService.insertStop(db, newStop)
    .then((res) => {
      res.status(201).json(xssStop)
    })
    .catch(next)
});

module.exports = tripsRouter;
