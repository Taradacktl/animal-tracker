const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {closeServer, runServer, app} = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const expect = chai.expect;
chai.should();
chai.use(chaiHttp);

/* describe('animal tracker API resource', function () {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
 
  after(function() {
     return closeServer();
  });
*/
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
//});