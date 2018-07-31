const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { closeServer, runServer, app, runExpress } = require('../server');
const { User } = require('../users/model');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { AnimalTracker } = require('../trackers/model');
const { testUtilSeedData } = require('./helpers')

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const emailAddress = 'me@example.com';
const password = 'haxxor';

const trackerSeedData = [
  {
    date: 'nov',
    timeOfDay: 'day',
    species: 'deer',
    activity: 'eating',
    lat: 78.987,
    lng: 7.890,
  }
]


describe('animal tracker API resource', function () {
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
  before(async function () {
    await runServer(TEST_DATABASE_URL);
    await testUtilSeedData(AnimalTracker, trackerSeedData)
  });

  after(function () {
    return closeServer();
  });


  beforeEach(async function () {
    await User.remove({});
    return User.hashPassword(password).then(hashedPassword => {
      // console.log('password/password hash' ,password, hashedPassword)
      return User.create({
        emailAddress,
        password: hashedPassword
      })
    }
    );
  });


  describe('Root URL', function () {

    it('should respond with a status of 200 and HTML', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  });

  describe('GET endpoint', function () {


    it('should return trackers with right fields', async function () {

      const res = await chai.request(app)
        .get('/trackers')
        .set('authorization', `Bearer ${token}`)
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.equal(0)

    });

  });

  describe('POST endpoint', function () {
    // strategy: make a POST request with data,
    // then prove that the post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new tracker', function () {

      const newTracker = {
        date: 'nov',
        timeOfDay: 'day',
        species: 'deer',
        activity: 'eating',
        lat: 78.987,
        lng: 7.890,
      };

      return chai.request(app)
        .post('/trackers')
        .set('authorization', `Bearer ${token}`)
        .send(newTracker)
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'date', 'timeOfDay', 'species', 'activity', 'lat', 'lng');
          res.body.date.should.equal(newTracker.date);
          // cause Mongo should have created id on insertion
          res.body.id.should.not.be.null;
          res.body.timeOfDay.should.equal(newTracker.timeOfDay);
          res.body.species.should.equal(newTracker.species);
          res.body.activity.should.equal(newTracker.activity);
          res.body.lat.should.equal(newTracker.lat);
          res.body.lng.should.equal(newTracker.lng);
          return AnimalTracker.findById(res.body.id);
        })
        .then(function (track) {
          track.date.should.equal(newTracker.date);
          track.timeOfDay.should.equal(newTracker.timeOfDay);
          track.species.should.equal(newTracker.species);
          track.activity.should.equal(newTracker.activity);
          track.lat.should.equal(newTracker.lat);
          track.lng.should.equal(newTracker.lng);
        });
    });
  });

  describe('PUT endpoint', function () {

    // strategy:
    //  1. Get an existing post from db
    //  2. Make a PUT request to update that post
    //  4. Prove post in db is correctly updated
    it('should update tracker fields', function () {
      const updateData = {
        date: 'dec',
        timeOfDay: 'night',
        species: 'coyote',
        activity: 'hunting',
        lat: 890.789,
        lng: 89.678,
      }
      
      return AnimalTracker
        .findOne()
        .then(track => {
          updateData.id = track.id;

          return chai.request(app)
            .put(`/trackers/${track.id}`)
            .set('authorization', `Bearer ${token}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return AnimalTracker.findById(updateData.id);
        })
        .then(track => {
          track.date.should.equal(updateData.date);
          track.timeOfDay.should.equal(updateData.timeOfDay);
          track.species.should.equal(updateData.species);
          track.activity.should.equal(updateData.activity);
          track.lat.should.equal(updateData.lat);
          track.lng.should.equal(updateData.lng);
        });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a post
    //  2. make a DELETE request for that post's id
    //  3. assert that response has right status code
    //  4. prove that post with the id doesn't exist in db anymore
    it('should delete a tracker by id', function () {

      let track;

      return AnimalTracker
        .findOne()
        .then(_track => {
          track = _track;
          return chai.request(app)
            .delete(`/trackers/${track.id}`)
            .set('authorization', `Bearer ${token}`)
        })
        .then(res => {
          res.should.have.status(204);
          return AnimalTracker.findById(track.id);
        })
        .then(_track => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_post.should.be.null` would raise
          // an error. `should.be.null(_post)` is how we can
          // make assertions about a null value.
          should.not.exist(_track);
        });
    });
  });

});
