# Ways App
 This app helps you plan the perfect trip! You can also see other trips to get ideas for your trip. 

 ## END POINTS
- Auth
    - `/api/auth/token`
        - POST
- Users
    - `/api/user`
        - POST
- Trips
    - `/api/trips`
        - GET
        - POST
    - `/api/trips/:id`
        - GET
        - PATCH
        - DELETE
- Stops
    - `/api/stops`
        - POST 
    - `/api/stops/:stop_id`
        - DELETE
        - PATCH
    - `/api/stops/:trip_id`
        - GET by trip
    - `/allStops/:user_id`
        - GET by the user

- Ratings
    - `/api/rating`
        - POST   
    - `/api/rating/check:id`
        - GET


## Tech Stack

### Development

- Node
  - Authentication JWT
  - RESTFUL API
- Postgresql
  - postgrator

### Testing

- SuperTest (integration tests)
- Mocha and Chai (unit tests)

### Production

- Deployed via Heroku
https://ways-database-api.herokuapp.com/

### Client
- client can be found
https://github.com/wzeiher3/trip-client.git

- Deployed via Vercel
https://ways-client.vercel.app/


## About the Devs

-[Devon Reihl](https://github.com/DevonReihl) -[Mark Force](https://github.com/Mf-ff99) -[Richard Scott](https://github.com/Richardscripts) -[Will Zeiher](https://github.com/wzeiher3) 