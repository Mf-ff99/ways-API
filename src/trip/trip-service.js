// Service Objects:
//  getTrips
//  getStops
//  getStopsByUserId?
//  getTripsByUserId?
//  getTripsWithStops?
//  getStopsByTripId?

// POST new trip, and new stops

const TripService = {
    getTrips(db) {
        return db('trips')
            .select('*')
            .then((res) => {
                return res;
            });
    },
    insertTrip(db, newTrip) {
        return db
            .insert(newTrip)
            .into('trips')
    },
    insertStop(db, newStop) {
        return db
        .insert(newStop)
        .into('stops')
    },
    getStops(db) {
        return db('stops')
            .select('*')
            .then((res) => {
                return res;
            });
    },
    getStopsById(db, id) {
        return db('stops')
            .where('trip_id', id)
    },

    serializeTrip(trip) {
        return {
            id: trip.id,
            trip_title: trip.title,
            rating: trip.rating,
            destination: trip.destination,
            days: trip.days,
            user_id: trip.user_id
        }
    }
};

module.exports = TripService;