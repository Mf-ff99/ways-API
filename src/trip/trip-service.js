// Service Objects:
//  getTrips
//  getStops
//  getStopsByUserId?
//  getTripsByUserId?
//  getTripsWithStops?
//  getStopsByTripId?
const xss = require("xss");

const TripService = {
  getTrips(db) {
    return db("trips")
      .select("*")
      .then((res) => {
        return res;
      });
  },
  insertTrip(db, newTrip) {
    return db.insert(newTrip).into("trips");
  },
  insertStop(db, newStop) {
    return db.insert(newStop).into("stops");
  },
  getStops(db) {
    return db("stops")
      .select("*")
      .then((res) => {
        return res;
      });
  },
  getStopsById(db, id) {
    return db("stops").where("trip_id", id);
  },

  getTripsForUser(db, user_id) {
      return db("trips").where("user_id", user_id)
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

  serializeStop(stop) {
    console.log(stop)
    return {
      trip_id: stop.trip_id,
      longitude: stop.longitude,
      latitude: stop.latitude,
      city: xss(stop.city),
      state: xss(stop.state),
      stop_name: xss(stop.stop_name),
      description: xss(stop.description),
      category: xss(stop.category),
    };
  },
};

module.exports = TripService;
