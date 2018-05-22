const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
const faker = require('faker');
const { closeServer, runServer, app, runExpress } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { AnimalTracker } = require('../users/model');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const testname = faker.random.word();
const testemailAddress = faker.random.word();

function generateUserData() {
  return {
    name: testname,
    emailAddress: testemailAddress,
    password: faker.random.word()
  }
}

describe('animal tracker API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  describe('Root URL', function () {

    describe('User', function () {

      it('should /create user', function () {
        const userInfo = {
          name: 'Julio',
          emailAddress: 'email@address',
          password: '1234'
        };
        return chai.request(app)
          .post('/users/create')
          .send(userInfo)
          .then(function (res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'name', 'emailAddress');
            res.body.name.should.equal(userInfo.name);
            res.body.emailAddress.should.equal(userInfo.emailAddress);
          });
      });

    });
    describe('/login', function () {
      it('Should reject requests with no credentials', function () {
        return chai
          .request(app)
          .post('/users/login')
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
  
            const res = err.response;
            expect(res).to.have.status(400);
          });
      });
      it('Should reject requests with incorrect usernames', function () {
        return chai
          .request(app)
          .post('/users/login')
          .send({ username: 'wrongUsername', password })        
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
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
          .post('/users/login')
          .send({ username, password: 'wrongPassword' })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
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
          .post('/users/login')
          .send({ username, password })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            const token = res.body.authToken;
            expect(token).to.be.a('string');
            const payload = jwt.verify(token, JWT_SECRET, {
              algorithm: ['HS256']
            });
            expect(payload.user).to.deep.equal({
              username,
              firstName,
              lastName
            });
          });
      });
    });
  
    describe('/refresh', function () {
      it('Should reject requests with no credentials', function () {
        return chai
          .request(app)
          .post('/users/refresh')
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
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
            username,
            firstName,
            lastName
          },
          'wrongSecret',
          {
            algorithm: 'HS256',
            expiresIn: '7d'
          }
        );
  
        return chai
          .request(app)
          .post('/users/refresh')
          .set('Authorization', `Bearer ${token}`)
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
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
              username,
              firstName,
              lastName
            },
            exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: username
          }
        );
  
        return chai
          .request(app)
          .post('/users/refresh')
          .set('authorization', `Bearer ${token}`)
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
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
              username,
              firstName,
              lastName
            }
          },
          JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: username,
            expiresIn: '7d'
          }
        );
        const decoded = jwt.decode(token);
  
        return chai
          .request(app)
          .post('/users/refresh')
          .set('authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            const token = res.body.authToken;
            expect(token).to.be.a('string');
            const payload = jwt.verify(token, JWT_SECRET, {
              algorithm: ['HS256']
            });
            expect(payload.user).to.deep.equal({
              username,
              firstName,
              lastName
            });
            expect(payload.exp).to.be.at.least(decoded.exp);
          });
      });
    });
  });
});

