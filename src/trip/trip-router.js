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
    const { short_description, destination, days, activities } = req.body;

    const newTrip = { short_description, destination, days, activities };

    newTrip.user_id = req.user.id;
    console.log(req.user.id);
    TripService.insertTrip(db, newTrip)
      .then((trip) => {
        res.status(201).json(TripService.serializeTrip(trip));
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
  
  TripService.insertStop(db, newStop)
    .then((newStop) => {
      res.status(201).json(TripService.serializeStop(newStop))
    })
    .catch(next)
})

module.exports = tripsRouter;
