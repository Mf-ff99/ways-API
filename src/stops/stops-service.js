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
  
    getStopsById(db, id) {
      return db("stops").where("trip_id", id);
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