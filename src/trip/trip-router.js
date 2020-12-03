const express = require("express");
// const bcrypt = require("bcryptjs");
const TripService = require("./trip-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { Console } = require("winston/lib/winston/transports");
const StopsService = require("../stops/stops-service");

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
    const {
      short_description,
      destination,
      days,
      activities,
      img,
      long,
      lat,
    } = req.body;

    const newTrip = {
      short_description,
      destination,
      days,
      activities,
      img,
      long,
      lat,
    };

    newTrip.user_id = req.user.id;
    TripService.insertTrip(db, newTrip)
      .then(([trip]) => {
        res.status(201).json(TripService.serializeTrip(trip));
      })
      .catch(next);
  });

tripsRouter
  .route("/:id")
  .all((req, res, next) => {
    TripService.getTripsById(req.app.get("db"), parseInt(req.params.id))
      .then((trip) => {
        if (!trip) {
          return res.status(404).json({
            error: { message: `Trip does not exist` },
          });
        }
        req.trip = trip;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    console.log(req.trip);
    res.json(req.trip);
  })
  .delete(requireAuth, (req, res, next) => {
    StopsService.getTripCreatorByTripId(req.app.get("db"), req.params.id).then(
      (verifiedID) => {
        if (verifiedID.user_id === req.user.id) {
          TripService.deleteTrip(req.app.get("db"), parseInt(req.params.id))
            .then(() => {
              res.status(204).end();
            })
            .catch(next);
        } else {
          res.status(401).json({
            error: `Unauthorized Access`,
          });
        }
      }
    );
  })
  .patch(requireAuth, (req, res, next) => {
    const {
      short_description,
      destination,
      days,
      activities,
      img,
      long,
      lat,
      rating,
    } = req.body;

    const updateTrip = {
      short_description,
      days,
      activities,
      img,
      long,
      lat,
      rating,
    };

    const valuesToUpdate = Object.values(updateTrip).filter(Boolean).length;
    if (valuesToUpdate === 0)
      return res.status(400).json({
        error: { message: `Request body must contain a value to be updated` },
      });

    StopsService.getTripCreatorByTripId(req.app.get("db"), req.params.id).then(
      (verifiedID) => {
        if (verifiedID.user_id === req.user.id) {
          TripService.updateTrip(
            req.app.get("db"),
            parseInt(req.params.id),
            updateTrip
          )
            .then((result) => {
              res.status(201).json(result);
            })
            .catch(next);
        } else {
          res.status(401).json({
            error: `Unauthorized Access`,
          });
        }
      }
    );
  });

// tripsRouter
//     .route('/rating')
//     .post(requireAuth, (req, res, next) => {
//       const { user_id, trip_id, rating} = req.body
//       console.log(user_id, trip_id, rating)
//     })

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

//   TripService.getTripCreatorByTripId(db, trip_id)
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
