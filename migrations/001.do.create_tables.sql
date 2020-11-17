CREATE TABLE ways_users (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trips (
    user_id INTEGER REFERENCES ways_users(id) ON DELETE CASCADE NOT NULL,
    id SERIAL PRIMARY KEY,
    date_added TIMESTAMPTZ NOT NULL DEFAULT now(),
    trip_title TEXT NOT NULL,
    rating INTEGER,
    destination TEXT
);

CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    longitude TEXT NOT NULL,
    latitude TEXT NOT NULL,
    city TEXT,
    state TEXT,
    stop_name TEXT,
    description TEXT,
    category TEXT
);

--  user_id_creator int references users (user_id) ON DELETE CASCADE NOT NULL,