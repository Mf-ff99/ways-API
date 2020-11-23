const express = require("express");
// const bcrypt = require("bcryptjs");
const StopService = require('./stops-service');
const { requireAuth } = require("../middleware/jwt-auth");
const { Console } = require("winston/lib/winston/transports");

const stopsRouter = express.Router();

stopsRouter.route("/:trip_id").get((req, res, next) => {
    const db = req.app.get("db");
    // get id of trip from params
  
    const id = req.params.trip_id;
<<<<<<< HEAD
    console.log(id)
    StopService.getStopsById(db, id)
=======
  
    StopService.getStopsByTripId(db, id)
>>>>>>> 0495613ed20c6783045ffb1df6ce640c61465dae
      .then((stops) => {
        return res.json(stops);
      })
      .catch(next);
  });

stopsRouter.route("/").post(requireAuth, (req, res, next) => {
    const db = req.app.get("db");
    const {
      trip_id,
      longitude,
      latitude,
      city,
      state,
      stop_name,
      description,
      category,
    } = req.body;
  
    const newStop = {
      trip_id,
      longitude,
      latitude,
      city,
      state,
      stop_name,
      description,
      category,
    };
  
    StopService.verifyTripCreatorAuth(db, trip_id)
      .then((verifiedID) => {
        if (verifiedID.user_id === req.user.id) {
          const xssStop = StopService.serializeStop(newStop);
          StopService.insertStop(db, xssStop)
            .then(() => {
              res.status(201).json(xssStop);
            })
            .catch(next);
        } else {
          res.status(401).json({
            error: `Unauthorized Access`,
          });
        }
      })
      .catch(next);
  });
  
  stopsRouter.route("/single/:id").all((req, res, next) => {
    StopService.getStopsById(req.app.get("db"), parseInt(req.params.id))
    
    .then(stop => {
      if(!stop) {
        return res.status(404).json({
          error: { message: `Stop does not exist`}
        })
      }
      res.stop = stop
      next()
    })
    .catch(next)
  }) 
  .get((req, res, next) => {
    res.json(res.stop)
  }) 
  .delete((req, res, next) => {
    StopService.deleteStop(
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
      trip_id,
      longitude,
      latitude,
      city,
      state,
      stop_name,
      description,
      category,
    } = req.body;
  
    const updateStop = {
      trip_id,
      longitude,
      latitude,
      city,
      state,
      stop_name,
      description,
      category,
    };
  
    const valuesToUpdate = Object.values(updateStop).filter(Boolean).length
    if (valuesToUpdate === 0)
    return res.status(400).json({
      error: {message: `Request body must contain a value to be updated`}
    }) 
    
    StopService.updateStop(
      req.app.get('db'),
      parseInt(req.params.id),
      updateStop
    )
    .then(() => {
      res.status(204).end()
    })
    .catch(next)
  })
  
  module.exports = stopsRouter;
  
    