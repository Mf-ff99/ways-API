const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')
const { TEST_DATABASE_URL } = require('../src/config')

describe.only('Protected Endpoints', function () {
    let db

    const testUsers = helpers.makeUserArray()
    const [testUser] = testUsers
    const [testTrips, testStops] = helpers.makeTripsAndStops(testUser)

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))
  
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`Endpoints unportected by user`, () => {
        const tripsSpecificEndpoint = [
            {
                title: `GET /api/trips`,
                path: `/api/trips`,
                method: supertest(app).get
            },

            {
                title: `GET /api/trips/stops`,
                path: `/api/trips/stops`,
                method: supertest(app).get
            },
        ]

        tripsSpecificEndpoint.forEach(endpoint => {
            describe(endpoint.title, () => {
                beforeEach('insert users, trips, and stops', () => {
                    return helpers.seedTrips(
                        db,
                        testUsers,
                        testTrips,
                        testStops,
                    )
                })

                it(`responds with 404 if user doesn't have any trips`, () => {
                    return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .send({})
                    .expect(404, {
                        error: `You don't have any trips`,
                    })
                })    
            })
        })
    })

    // describe(`GET /api/trips`, () => {
    //     const [ usersTrip ] = testTrips.filter(
    //         trip => trip.user_id === testUser.id
    //     )
    //     const usersStops = testStops.filter(
    //         stop => stop.trip_id == usersTrip.id
    //     )
        
    //     it(`responds with 200 and users's trips and stops`, () => {
    //         return supertest(app)
    //         .get(`/api/trips`)
    //         .set('Authorization', helpers.makeAuthHeader(testUser))
    //         .expect(200)
    //         .expect(res => {
    //             // expect(res.body).to.have.keys('trips', 'stops')
    //             expect(res.body.trips).to.have.property('id', usersTrip.id)
                
    //         })

    //     })
    // })
})