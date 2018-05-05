const chai = require('chai');
const chaiHttp = require('chai-http');
//const mongoose = require('mongoose');
//const faker = require('faker');
//const {DATABASE_URL, TEST_DATABASE_URL} = //require('../config');
//const {Raid} = require('../models/raid-model');
//const {User} = require('../models/user-model');
//const {closeServer, runServer, app} = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Root URL', function() {
    it('should respond with a status of 200 and HTML', function() {
      return chai.request(app)
        .get('/')
        .then(function(result) {
          result.should.have.status(200);
          result.should.be.html;
        });
    });
  });