const bcrypt = require('bcryptjs');
const e = require('express');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../../config');

const AuthService = {
  registerUser(db, newUser) {
    return db('ways_users')
      .insert(newUser)
      .returning('*')
      .then((res) => {
        return res[0];
      });
  },
  getUsername(db, user_name) {
    return db('users').where({ user_name }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
};

module.exports = AuthService;
