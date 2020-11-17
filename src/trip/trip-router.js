const express = require('express');
const bcrypt = require('bcryptjs');
const TripService = require('./trip-service')

const tripsRouter = express.Router();



tripsRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
      TripService.getTrips(db).then(trips => {
        return res.json(trips)
      })
      .catch(next)  
  })

  module.exports = tripsRouter;