const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
const faker = require('faker');
const {closeServer, runServer, app, runExpress} = require('../server');
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

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
 
  after(function() {
     return closeServer();
  });

  describe('Root URL', function() {
 
  it('should respond with a status of 200 and HTML', function() {
    return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
	  
   describe('AnimalTracker', function() {	  
	
   it('should login on POST', function() {
    const userName = {
        name: 'Julio', emailAddress: 'email@address'};
    return chai.request(app)
      .post('/login')
      .send(userName)
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'emailAddress');
        res.body.name.should.equal(userName.name);
        res.body.emailAddress.should.equal(userName.emailAddress);
      });
  });	  
	  
  });
});

 });
