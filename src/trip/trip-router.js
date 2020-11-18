const express = require("express");
const bcrypt = require("bcryptjs");
const TripService = require("./trip-service");

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
  .post((req, res, next) => {
    const db = req.app.get("db");
    const {} = req.body;

    const newTrip = {};

    for (const [key, value] of Object.entries(newTrip))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    newTrip.user_id = req.user.user_id;

    TripService.insertTrip(db, newTrip)
      .then((trip) => {
        res.status(201).json(TripServce.serializeTrip(trip));
      })
      .catch(next);
  });

tripsRouter.route("/stops/:trip_id").get((req, res, next) => {
  const db = req.app.get("db");
  const id = req.params.trip_id
  console.log(id)
  TripService.getStopsById(db, id)
    .then((stops) => {
      return res.json(stops);
    })
    .catch(next);
});

module.exports = tripsRouter;
