const xss = require("xss");

const StopService = {
    
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
  
<<<<<<< HEAD
    getStopsById(db, id) {
      return db
            .select("stops.trip_id", "stops.longitude", "stops.latitude", "stops.city", "stops.state", "stops.stop_name", "stops.description", "stops.category")
            .from('stops')
            .join('trips', {
              'trips.id': 'stops.trip_id'
            })
            .where("stops.trip_id", id);
=======
    getStopsByTripId(db, id) {
      return db("stops").where("trip_id", id);
>>>>>>> 0495613ed20c6783045ffb1df6ce640c61465dae
    },
    
    getStopsById(db, id) {
      return db("stops").where("id", id);
    },

    deleteStop(db, id) {
      return db("stops").where({ id }).delete()
    },
  
    updateStop(db, id, newStopFields) {
      return db("stops").where({ id }).update(newStopFields)
    },
  
    serializeStop(stop) {
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
    verifyTripCreatorAuth(db, id) {
      return db("trips").select("user_id").where({ id }).first();
    },
  };
  
  module.exports = StopService;