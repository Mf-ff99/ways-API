BEGIN;

TRUNCATE
  stops,
  trips,
  ways_users;

INSERT INTO ways_users 
(id, user_name, password) 
VALUES 
(1, 'John Rambo', 'password'),
(2, 'Tony Starks', 'password'),
(3, 'Natasha Romanova', 'password');

INSERT INTO trips
(id, user_id, trip_title, rating, destination, days, activities) 
VALUES 
(1, 1, 'Disneyworld', 5, 'Orlando, FL', 1, 'DisneyLand, Wax-Museum'),
(2, 2, 'New York, baby!', 2, 'New York, NY', 2, 'Shopping, Sight-Seeing'),
(3, 3, 'Las Vegas', 4, 'Las Vegas, NV', 3, 'Casinos, Sight-Seeing');

INSERT INTO stops 
(trip_id, longitude, latitude, city, state, stop_name, description, category) 
VALUES 
(1, '-81.5639', '28.3852', 'Orlando', 'FL', 'Disneyworld', 'The Walt Disney World Resort, also called Walt Disney World and Disney World, is an entertainment complex in Bay Lake and Lake Buena Vista, Florida, in the United States, near the cities of Orlando and Kissimmee.', 'tourist_attraction'),
(1, '-81.5639', '28.3852','Orlando', 'FL', 'Madame Tussauds', 'See life-size figures of your favorite celebrities at Madame Tussauds Orlando with this pre-purchased admission.', 'tourist_attraction'),
(2, '-73.985130', '40.758896', 'New York City', 'NY', 'Times Square', 'Lots of cool shit to see here', 'tourist_attraction'),
(2, '-73.966562', '40.781317', 'New York City', 'NY', 'Central Park', 'This is a big ass park. Go here for your daily does of greenery.', 'tourist_attraction'),
(3, '-115.1398', '36.1699','Las Vegas', 'NV', 'Eiffel Tower', 'Elevated French haunt offering Strip views from the 11th floor of Paris Las Vegas', 'tourist_attraction'),
(3, '-115.1398', '36.1699','Las Vegas', 'NV', 'Venetian Hotel', 'The Venetian Hotel in Las Vegas is located on the Strip, across from Treasure Island.', 'tourist_attraction');

SELECT setval('stops_id_seq', (SELECT MAX(id) from "stops"));
SELECT setval('trips_id_seq', (SELECT MAX(id) from "trips"));
SELECT setval('ways_users_id_seq', (SELECT MAX(id) from "ways_users"));

COMMIT;

