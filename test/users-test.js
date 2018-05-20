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
    const name = 'exampleUser';
  const password = 'examplePass';
  const emailAddress = '1234'
 
  it('should respond with a status of 200 and HTML', function() {
    return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
     /*
    describe('/create', function () {
     describe('POST', function () {
      it('Should create a new user', function () {
        return chai
          .request(app)
          .post('/create')
          .send({
            name,
            password,
            emailAddress
          })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'name',
            'emailAddress'
             
            );
            expect(res.body.name).to.equal(name);
            expect(res.body.emailAddress).to.equal(emailAddress);
            return User.findOne({
              name
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.name).to.equal(name);
            expect(user.emailAddress).to.equal(emailAddress);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      }); */
  describe('User', function() {	  
	
   it('should get user info', function() {
    const userInfo = {
        name: 'Julio', emailAddress: 'email@address'};
    return chai.request(app)
      .post('/create')
      .send(userInfo)
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'name', 'emailAddress');
        res.body.name.should.equal(userInfo.name);
        res.body.emailAddress.should.equal(userInfo.emailAddress);
      });
  });	  
	  
  });
 
});

}); 

