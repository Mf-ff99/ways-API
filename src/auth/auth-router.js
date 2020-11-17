const express = require('express');
const bcrypt = require('bcryptjs');
const AuthService = require('./auth-service');


const authRouter = express.Router();


authRouter
  .route('/register')
  .post((req, res, next) => {
    let { password, user_name } = req.body;
    let newUser = {  password, user_name };
    if (!password || !user_name) {
      return res
        .status(400)
        .json({ error: 'Bad Request - Missing Credentials' });
    } else if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        error: 'Password must be atleast 8 characters',
      });
    } else {
        newUser.password = bcrypt.hashSync(password);
        AuthService.getUsername(req.app.get('db'), user_name).then((result) => {
          if (result) {
            return res.status(400).json({ error: 'Username Already Exists' });
          }
          AuthService.registerUser(req.app.get('db'), newUser)
            .then((user) => {
              return res.status(201).send({
                authToken: AuthService.createJwt(user.user_name, {
                  user_id: user.user_id,
                  user_name: user.user_name,
                }),
                user_id: user.user_id,
              });
            })
            .catch(next);
        });
    }
  });

authRouter.post('/login', (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_email, password };

  for (const [key, value] of Object.entries(loginUser))
    if (!value)
      return res.status(400).json({
        error: `Missing '${key}' in request`,
      });
  AuthService.getUserEmail(req.app.get('db'), loginUser.user_email)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: 'Invalid Credentials',
        });
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: 'Invalid Credentials',
          });

        const sub = dbUser.user_email;
        const payload = {
          user_id: dbUser.user_id,
          user_name: dbUser.user_name,
        };
        res.json({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })

    .catch(next);
});

module.exports = authRouter;
