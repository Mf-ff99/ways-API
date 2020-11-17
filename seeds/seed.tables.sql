BEGIN;

TRUNCATE
  stops,
  trips,
  ways_users;

INSERT INTO ways_users 
(user_name, password) 
VALUES 
('John Rambo', 'password'),
('Tony Starks', 'password'),
('Natasha Romanova', 'password');

INSERT INTO trips
(user_id, trip_title, rating, destination) 
VALUES 
(1, 'Disneyworld', 5, 'Orlando, FL'),
(2, 'New York, baby!', 2, 'New York, NY'),
(3, 'Las Vegas', 4, 'Las Vegas, NV');

INSERT INTO stops 
(trip_id, longitude, latitude, city, state, stop_name, description, category) 
VALUES 
(1, '28.3852', '81.5639', 'Orlando', 'FL', 'Disneyworld', 'The Walt Disney World Resort, also called Walt Disney World and Disney World, is an entertainment complex in Bay Lake and Lake Buena Vista, Florida, in the United States, near the cities of Orlando and Kissimmee.', 'tourist_attraction'),
(1, '28.3852', '81.5639','Orlando', 'FL', 'Madame Tussauds', 'See life-size figures of your favorite celebrities at Madame Tussauds Orlando with this pre-purchased admission.', 'tourist_attraction'),
(2, '-73.985130', '40.758896', 'New York City', 'NY', 'Times Square', 'Lots of cool shit to see here', 'tourist_attraction'),
(2, '-73.968285', '40.785091', 'New York City', 'NY', 'Central Park', 'This is a big ass park. Go here for your daily does of greenery.', 'tourist_attraction'),
(3, '36.1699', '115.1398','Las Vegas', 'NV', 'Eiffel Tower', 'Elevated French haunt offering Strip views from the 11th floor of Paris Las Vegas', 'tourist_attraction'),
(3, '36.1699', '115.1398','Las Vegas', 'NV', 'Venetian Hotel', 'The Venetian Hotel in Las Vegas is located on the Strip, across from Treasure Island.', 'tourist_attraction');

COMMIT;

