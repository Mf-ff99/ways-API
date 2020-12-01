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

  insertRating(db, rating) {
    return db.insert(rating).into("ratings").returning("*")
  },

  checkForDuplicateRating(db, userInfo) {
    return db('ratings')
    .select('ratings.user_id', 'ratings.trip_id')
    .where('ratings.trip_id', userInfo.id)
    .returning('*')
  },

  insertTrip(db, newTrip) {
    return db.insert(newTrip).into("trips").returning("*");
  },

  // getStops(db) {
  //   return db("stops")
  //     .select("*")
  //     .then((res) => {
  //       return res;
  //     });
  // },

  // insertStop(db, newStop) {
  //   return db.insert(newStop).into("stops");
  // },

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

  // getStopsById(db, id) {
  //   return db("stops").where("trip_id", id);
  // },

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

  // deleteStop(db, id) {
  //   return db("stops").where({ id }).delete()
  // },

  updateTrip(db, id, newTripFields) {
    return db("trips").where({ id }).update(newTripFields).returning("*");
  },

  // updateStop(db, id, newStopFields) {
  //   return db("stops").where({ id }).update(newStopFields)
  // },

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

  // serializeStop(stop) {
  //   return {
  //     trip_id: stop.trip_id,
  //     longitude: stop.longitude,
  //     latitude: stop.latitude,
  //     city: xss(stop.city),
  //     state: xss(stop.state),
  //     stop_name: xss(stop.stop_name),
  //     description: xss(stop.description),
  //     category: xss(stop.category),
  //   };
  // },
  verifyTripCreatorAuth(db, id) {
    return db("trips").select("user_id").where({ id }).first();
  },
};

module.exports = TripService;
