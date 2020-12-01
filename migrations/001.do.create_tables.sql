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
    short_description TEXT NOT NULL, 
    long FLOAT,
    lat FLOAT,
    rating INTEGER DEFAULT NULL,
    destination TEXT,
    activities TEXT,
    img text,
    days int
);

CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    longitude FLOAT,
    latitude FLOAT,
    city TEXT,
    state TEXT,
    stop_name TEXT,
    description TEXT,
    category TEXT,
    img TEXT
);

--  user_id_creator int references users (user_id) ON DELETE CASCADE NOT NULL,