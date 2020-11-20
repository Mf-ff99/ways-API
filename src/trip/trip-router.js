const express = require("express");
// const bcrypt = require("bcryptjs");
const TripService = require("./trip-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { Console } = require("winston/lib/winston/transports");

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
    const {
      short_description,
      destination,
      days,
      activities,
      rating,
    } = req.body;

    const newTrip = {
      short_description,
      destination,
      days,
      activities,
      rating,
    };

    newTrip.user_id = req.user.id;
    
    // for (const [key, value] of Object.entries(newTrip)) {
    //   if (value == null) {
    //     return res.status(400).json({
    //       error: { message: `Missing '${key}' in request body` }
    //     })
    //   }
    // }

    TripService.insertTrip(db, newTrip)
      .then((trip) => {
        res.status(201).json(TripService.serializeTrip(trip));
      })
      .catch(next);
  });

tripsRouter.route("/:id").all((req, res, next) => {
  TripService.getTripsById(req.app.get("db"), parseInt(req.params.id))

  .then(trip => {
    if(!trip) {
      return res.status(404).json({
        error: { message: `Trip does not exist`}
      })
    }
    res.trip = trip
    next()
  })
  .catch(next)
}) 
.get((req, res, next) => {
  res.json(res.trip)
}) 
.delete((req, res, next) => {
  TripService.deleteTrip(
    req.app.get('db'),
    parseInt(req.params.id)
  )
  .then( () => {
    res.status(204).end()
  })
  .catch(next)
})
.patch((req, res, next) => {
  const {
    short_description,
    destination,
    days,
    activities,
    rating,
  } = req.body;

  const updateTrip = {
    short_description,
    destination,
    days,
    activities,
    rating,
  };

  const valuesToUpdate = Object.values(updateTrip).filter(Boolean).length
  if (valuesToUpdate === 0)
  return res.status(400).json({
    error: {message: `Prequest body must contain a value to be updated`}
  }) 
  
  TripService.updateTrip(
    req.app.get('db'),
    parseInt(req.params.id),
    updateTrip
  )
  .then(() => {
    res.status(204).end()
  })
  .catch(next)
})

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
  const { id, longitude, latitude, city, state, stop_name, description, category } = req.body;

  const newStop = { id, longitude, latitude, city, state, stop_name, description, category }
  const xssStop = TripService.serializeStop(newStop)
  
  TripService.insertStop(db, newStop)
    .then((newStop) => {
      res.status(201).json(xssStop)
    })
    .catch(next)
});

module.exports = tripsRouter;
