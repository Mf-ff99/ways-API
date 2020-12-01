const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')
const { TEST_DATABASE_URL } = require('../src/config')


describe('Stops Endpoints', function() {
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

    describe.skip('GET /api/stops', () => {
        context(`Given no stops`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                .get('/api/stops')
                .expect(200, [])
            })
        })

        context(`Given there are stops in the database`, () => {
            beforeEach('insert users and trips', () => helpers.seedTrips(db, testUsers, testTrips, testStops))
        })
    })
}) 