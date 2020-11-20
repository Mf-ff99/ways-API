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
      .then(async (trips) => {
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
    const xssTrip = TripService.serializeTrip(newTrip);
    TripService.insertTrip(db, xssTrip)
      .then((trip) => {
        res.status(201).json(xssTrip);
      })
      .catch(next);
  });

tripsRouter.route("/single/:id").all((req, res, next) => {
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
    error: {message: `Request body must contain a value to be updated`}
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

// tripsRouter.route("/stops/:trip_id").get((req, res, next) => {
//   const db = req.app.get("db");
//   // get id of trip from params

//   const id = req.params.trip_id;

//   TripService.getStopsById(db, id)
//     .then((stops) => {
//       return res.json(stops);
//     })
//     .catch(next);
// });

// tripsRouter.route("/stops").post(requireAuth, (req, res, next) => {
//   const db = req.app.get("db");
//   const {
//     trip_id,
//     longitude,
//     latitude,
//     city,
//     state,
//     stop_name,
//     description,
//     category,
//   } = req.body;

//   const newStop = {
//     trip_id,
//     longitude,
//     latitude,
//     city,
//     state,
//     stop_name,
//     description,
//     category,
//   };

//   TripService.verifyTripCreatorAuth(db, trip_id)
//     .then((verifiedID) => {
//       if (verifiedID.user_id === req.user.id) {
//         const xssStop = TripService.serializeStop(newStop);
//         TripService.insertStop(db, xssStop)
//           .then(() => {
//             res.status(201).json(xssStop);
//           })
//           .catch(next);
//       } else {
//         res.status(401).json({
//           error: `Unauthorized Access`,
//         });
//       }
//     })
//     .catch(next);
// });

// tripsRouter.route("/stops/single/:id").all((req, res, next) => { //route issues
//   TripService.getStopsById(req.app.get("db"), parseInt(req.params.id))

//   .then(stop => {
//     if(!stop) {
//       return res.status(404).json({
//         error: { message: `Stop does not exist`}
//       })
//     }
//     res.stop = stop
//     next()
//   })
//   .catch(next)
// }) 
// .get((req, res, next) => {
//   res.json(res.stop)
// }) 
// .delete((req, res, next) => {
//   TripService.deleteStop(
//     req.app.get('db'),
//     parseInt(req.params.id)
//   )
//   .then( () => {
//     res.status(204).end()
//   })
//   .catch(next)
// })
// .patch((req, res, next) => {
//   const {
//     trip_id,
//     longitude,
//     latitude,
//     city,
//     state,
//     stop_name,
//     description,
//     category,
//   } = req.body;

//   const updateStop = {
//     trip_id,
//     longitude,
//     latitude,
//     city,
//     state,
//     stop_name,
//     description,
//     category,
//   };

//   const valuesToUpdate = Object.values(updateStop).filter(Boolean).length
//   if (valuesToUpdate === 0)
//   return res.status(400).json({
//     error: {message: `Request body must contain a value to be updated`}
//   }) 
  
//   TripService.updateStop(
//     req.app.get('db'),
//     parseInt(req.params.id),
//     updateStop
//   )
//   .then(() => {
//     res.status(204).end()
//   })
//   .catch(next)
// })

module.exports = tripsRouter;
