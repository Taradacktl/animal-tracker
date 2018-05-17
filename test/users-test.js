const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
//const faker = require('faker');
const {closeServer, runServer, app, runExpress} = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { AnimalTracker } = require('../users/model');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

 describe('user tracker API resource', function () {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
 
  after(function() {
     return closeServer();
  });

  describe('Login URL', function() {
 
  it('should respond with a status of 200 and HTML', function() {
    return chai.request(app)
        .get('/users/login')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
        });
    });
  });
});