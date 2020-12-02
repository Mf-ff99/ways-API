const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe.only('Ratings Endpoint', function() {
    let db

    const testUsers = helpers.makeUserArray()
    const [testUser] = testUsers
    const [testTrips] = helpers.makeTripsAndStops(testUser)
    const testRating = helpers.makeRatingsArray()

 
    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))
  
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/rating/check/:id', () => {
        context(`Given no ratings`, () => {
            beforeEach('insert users and trips', () => helpers.seedTripsAndStopsAndRatings(db, testUsers, testTrips))

            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                .get(`/api/rating/check/${testTrips[0]}`)
                .expect(200, [])
            })
        })
    })
})