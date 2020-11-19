require('dotenv').config();
const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



//create a knex instance to postgres
function makeKnexInstance() {
    return knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    })
}

function makeUserArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            password: 'password',
        },
        {
            id: 2,
            user_name: 'test-user-2',
            password: 'password!',
        },
    ]
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

function cleanTables(db) {
    return db.transaction(trx => 
        trx.raw(
            `TRUNCATE
                "stops",
                "trips",
                "ways_users"`
        )
        .then(() => 
            Promise.all([
                trx.raw(`ALTER SEQUENCE stops_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE trips_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE ways_users_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('stops_id_seq', 0)`),
                trx.raw(`SELECT setval('trips_id_seq', 0)`),
                trx.raw(`SELECT setval('ways_users_id_seq', 0)`),
                
                

            ])
        )
    )
}

function seedUsers(db, ways_users) {
    const preppedUsers = ways_users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.transaction(async trx => {
        await trx.into('ways_users').insert(preppedUsers)

        await trx.raw(
            `SELECT setval('ways_users_id_seq', ?)`,
            [ways_users[ways_users.length - 1].id],
        )
    })
}


module.exports = {
    makeKnexInstance,
    makeUserArray,
    makeAuthHeader,
    cleanTables,
    seedUsers,
}