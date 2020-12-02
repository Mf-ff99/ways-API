// Service Objects:

const xss = require("xss");
//select trip_id, sum(rating)
// from ratings r
// group by trip_id
const TripService = {
  getTrips(db) {
    return db("ratings")
      .select("ratings.rating")
      .sum('ratings.rating AS rating')
      .fullOuterJoin('trips', 'trips.id', '=', 'ratings.trip_id')
      .select('trips.short_description', 'trips.id', 'trips.destination', 'trips.activities', 'trips.img', 'trips.days', 'trips.date_added', 'trips.user_id')
      .groupBy('ratings.rating','trips.short_description', 'trips.id', 'trips.destination', 'trips.activities', 'trips.img', 'trips.days', 'trips.date_added', 'trips.user_id')
      .then((res) => {
        return res;
      });
  },

  // insertRating(db, rating) {
  //   return db.insert(rating).into("ratings").returning("*")
  // },

  // checkForDuplicateRating(db, userInfo) {
  //   return db('ratings')
  //   .select('ratings.user_id', 'ratings.trip_id')
  //   .where('ratings.trip_id', userInfo.id)
  //   .returning('*')
  // },

  insertTrip(db, newTrip) {
    return db.insert(newTrip).into("trips").returning("*");
  },

  getTripsById(db, id) {
    // return db("trips").where("id", id);
    return db("ratings")
      .select("ratings.rating")
      .sum('ratings.rating AS rating')
      .fullOuterJoin('trips', 'trips.id', '=', 'ratings.trip_id')
      .select('trips.short_description', 'trips.id', 'trips.destination', 'trips.activities', 'trips.img', 'trips.days', 'trips.date_added', 'trips.user_id')
      .where("trips.id", id)
      .groupBy('ratings.rating', 'trips.short_description', 'trips.id', 'trips.destination', 'trips.activities', 'trips.img', 'trips.days', 'trips.date_added', 'trips.user_id')
      // .then((res) => {
      //   return res;
      // });
  },

  getTripsForUser(db, user_id) {
    // return db("trips").where("user_id", user_id);
    return db("ratings")
      .select("ratings.rating")
      .sum('ratings.rating AS rating')
      .fullOuterJoin('trips', 'trips.id', '=', 'ratings.trip_id')
      .select('trips.short_description', 'trips.id', 'trips.destination', 'trips.activities', 'trips.img', 'trips.days', 'trips.date_added', 'trips.user_id')
      .where("trips.user_id", user_id)
      .groupBy('ratings.rating', 'trips.short_description', 'trips.id', 'trips.destination', 'trips.activities', 'trips.img', 'trips.days', 'trips.date_added', 'trips.user_id')
      // .then((res) => {
  },

  deleteTrip(db, id) {
    return db("trips").where({ id }).delete();
  },

  updateTrip(db, id, newTripFields) {
    return db("trips").where({ id }).update(newTripFields).returning("*");
  },

  serializeTrip(trip) {
    return {
      id: trip.id,
      short_description: xss(trip.short_description),
      rating: trip.rating,
      destination: xss(trip.destination),
      days: trip.days,
      activities: trip.activities,
      user_id: trip.user_id,
      img: trip.img,
    };
  },

  verifyTripCreatorAuth(db, id) {
    return db("trips").select("user_id").where({ id }).first();
  },
};

module.exports = TripService;
