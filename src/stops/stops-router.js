const express = require("express");
// const bcrypt = require("bcryptjs");
const StopService = require("./stops-service");
const { requireAuth } = require("../middleware/jwt-auth");
const { Console } = require("winston/lib/winston/transports");

const stopsRouter = express.Router();

stopsRouter.get("/:trip_id", (req, res, next) => {
  const db = req.app.get("db");
  // get id of trip from params

  const id = req.params.trip_id;

  StopService.getStopsById(db, id)
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
        StopService.insertStop(db, newStop)
          .then(([result]) => {
            return res.status(201).json(StopService.serializeStop(result));
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

stopsRouter
  .route("/:stop_id")
  .all((req, res, next) => {
    StopService.getStopsById(req.app.get("db"), parseInt(req.params.stop_id))
      .then((stop) => {
        if (!stop) {
          return res.status(404).json({
            error: { message: `Stop does not exist` },
          });
        }
        res.stop = stop;
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    StopService.deleteStop(req.app.get("db"), parseInt(req.params.stop_id))
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
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

    const valuesToUpdate = Object.values(updateStop).filter(Boolean).length;
    if (valuesToUpdate === 0)
      return res.status(400).json({
        error: { message: `Request body must contain a value to be updated` },
      });

    StopService.updateStop(
      req.app.get("db"),
      parseInt(req.params.stop_id),
      updateStop
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = stopsRouter;