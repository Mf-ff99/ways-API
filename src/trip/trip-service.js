// Service Objects:

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
  getStops(db) {
    return db("stops")
      .select("*")
      .then((res) => {
        return res;
      });
  },
  insertStop(db, newStop) {
    return db.insert(newStop).into("stops");
  },
  getTripsById(db, id) {
    return db("trips").where("id", id);
  },

  getStopsById(db, id) {
    return db("stops").where("trip_id", id);
  },

  getTripsForUser(db, user_id) {
      return db("trips").where("user_id", user_id)
  },

  deleteTrip(db, id) {
    return db("trips").where({ id }).delete()
  },

  updateTrip(db, id, newTripFields) {
    return db("trips").where({ id }).update(newTripFields)
  },

  serializeTrip(trip) {
    return {
      id: trip.id,
      short_description: xss(trip.title),
      rating: trip.rating,
      destination: xss(trip.destination),
      days: trip.days,
      user_id: trip.user_id,
    };
  },

  serializeStop(stop) {
    // console.log(stop)
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
