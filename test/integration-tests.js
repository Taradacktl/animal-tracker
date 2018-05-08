const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {closeServer, runServer, app} = require('../server');

const expect = chai.expect;
chai.should();
chai.use(chaiHttp);

describe('Root URL', function() {

 before(function() {
   return runServer();
 });

 after(function() {
    return closeServer();
 });

  it('should respond with a status of 200 and HTML', function() {
    return chai.request(app)
        .get('/')
        .then(function(result) {
          result.should.have.status(200);
          result.should.be.html;
        });
    });
  });
