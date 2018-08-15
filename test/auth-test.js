'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users/model');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

const AUTH_REFRESH_ROUTE = '/auth/refresh-auth-token'

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Auth endpoints', function () {
  const emailAddress = 'me@example.com';
  const password = 'haxxor';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(async function () {
    await User.remove({});
    return User.hashPassword(password).then(hashedPassword =>{    
      // console.log('password/password hash' ,password, hashedPassword)
      return User.create({
        emailAddress,
        password:hashedPassword
      }) }
    );
  });

  afterEach(function () {
    // return User.remove({});
  });

  describe('/auth/login', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/auth/login')
        // .send({})
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(400);
        });
    });
    it('Should reject requests with incorrect emailAddress', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ emailAddress: 'wrongemailAddress', password })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with incorrect passwords', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ emailAddress, password: 'wrongPassword' })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should return a valid auth token', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ emailAddress, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });

          expect(payload.user.emailAddress).to.equal(emailAddress)
          
        });
    });
  });

  describe(AUTH_REFRESH_ROUTE, function () {
    it('Should reject requests with no JWT token', function () {
      return chai
        .request(app)
        .post('/auth/refresh-auth-token')        
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign(
        {
          emailAddress,        
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post(AUTH_REFRESH_ROUTE)
        .set('Authorization', `Bearer ${token}`)
        // .then(() =>
        //   expect.fail(null, null, 'Request should not succeed')
        // )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an expired token', function () {
      const token = jwt.sign(
        {
          user: {
            emailAddress,
          },
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: emailAddress,
          expiresIn: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        }
      );

      return chai
        .request(app)
        .post('/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should return a valid auth token with a newer expiry date', function () {
      const token = jwt.sign(
        {
          user: {
            emailAddress,
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: emailAddress,
          expiresIn: '7d'
        }
      );
      const decoded = jwt.decode(token);

      return chai
        .request(app)
        .post('/auth/refresh-auth-token')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          console.log('AUTH TOKEN', res.body.authToken )
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          // console.log('PAYLOAD for /auth/refresh', payload)
          expect(payload.user.emailAddress).to.equal(emailAddress)
          // expect(payload.user.emailAddress).to.equal(emailAddress)
          expect(payload.exp).to.be.at.least(decoded.exp);
        });
    });
  });
});
