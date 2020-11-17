const TripService = {
    getTrips(db) {
      return db('trips')
        .select('*')
        .then((res) => {
          return res;
        });
    },
  };
  
  module.exports = TripService;