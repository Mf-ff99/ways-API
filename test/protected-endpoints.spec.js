const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Protected Endpoints', function () {
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

    beforeEach('insert users, trips and stops', () => {
        return helpers.seedTripsAndStops(
            db,
            testUsers,
            testTrips,
            testStops,
        )
    })

    const protectedEndpoints = [
        {
            title: 'POST /api/trips',
            path: '/api/trips',
            method: supertest(app).post,
        },

        // {
        //     title: 'PATCH /api/trips',
        //     path: '/api/trips',
        //     method: supertest(app).patch,
        // },

        // {
        //     title: 'POST /api/trips/stops',
        //     path: '/api/trips/stops',
        //     method: supertest(app).post,
        // },
    ]

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.title, () => {
            it(`responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                .expect(401, { error: `Missing bearer token` })
            })

            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return endpoint.method(endpoint.path)
                .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                .expect(401, { error: `Unauthorized request` })
            })

            it(`responds 401 'Unauthorize request' when invalide sub in payload`, () => {
                const invalidUser = { user_name: 'user-not-existy', id: 1 }
                return endpoint.method(endpoint.path)
                .set('Authorization', helpers.makeAuthHeader(invalidUser))
                .expect(401, { error: `Unauthorized request` })
            })
        })
    })
})