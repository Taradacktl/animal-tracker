const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const faker = require('faker');
const { closeServer, runServer, app, runExpress } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { AnimalTracker } = require('../users/model');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);
const { JWT_SECRET } = require('../config');
const testname = faker.random.word();
const testemailAddress = faker.random.word();

function generateUserData() {
  return {
    emailAddress: testemailAddress,
    password: faker.random.word()
  }
}

describe('animal tracker API resource', function () {
  const emailAddress = 'exampleemailAddress';
      const password = 'examplePass';

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
            res.body.should.include.keys('id', 'emailAddress');
            res.body.emailAddress.should.equal(userInfo.emailAddress);
          });
      });
    });
  });
});

