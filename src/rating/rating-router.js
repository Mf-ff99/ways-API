const express = require("express");
// const bcrypt = require("bcryptjs");
const TripService = require("../trip/trip-service");
const { requireAuth } = require("../middleware/jwt-auth");

const ratingRouter = express.Router();

ratingRouter
    .route("/")
    .post(requireAuth, (req, res, next) => {
        const db = req.app.get("db");
        const { trip_id, user_id, rate } = req.body
        let rating = rate
        const newRating = {trip_id, user_id, rating}
        TripService.insertRating(db, newRating)
            .then((rating) => {
                // console.log(res)
                res.status(201).json(rating)
            })
            .catch(next)
    })
    // .get((req, res, next) => {
    //     const db = req.app.get("db");
    //     const { trip_id, user_id, rate } = req.body
    //     let rating = rate
    //     const newRating = {trip_id, user_id, rating}
    //     TripService.insertRating(db, newRating)
    //         .then((rating) => {
    //             // console.log(res)
    //             res.status(304).json(rating)
    //         })
    //         .catch(next)
    // });

ratingRouter
// check database for duplicate key values
    .route("/check/:id")
    .get(requireAuth, (req, res, next) => {
        const db = req.app.get("db");
        const { id } = req.params
        const user_id = req.user.id
        const userInfo = { id, user_id}
        TripService.checkForDuplicateRating(db, userInfo)
            .then((info) => {
                res.json(info)
            })
            .catch(next)
    });

module.exports = ratingRouter
