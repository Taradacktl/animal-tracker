const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const mongoose = require('mongoose');
//const faker = require('faker');
//const {closeServer, runServer, app} = require('../server');
//const { TEST_DATABASE_URL } = require('../config');
const expect = chai.expect;
const should = chai.should();
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
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  });

 describe('GET endpoint', function () {

    it('should return all existing posts', function () {
      // strategy:
      //    1. get back all posts returned by by GET request to `/posts`
      //    2. prove res has right status, data type
      //    3. prove the number of posts we got back is equal to number
      //       in db.
      let res;
      return chai.request(app)
        .get('/posts')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.should.have.lengthOf.at.least(1);

          return AnimalTracker.count();
        })
        .then(count => {
          // the number of returned posts should be same
          // as number of posts in DB
          res.body.should.have.lengthOf(count);
        });
    });

    it('should return posts with right fields', function () {
      // Strategy: Get back all posts, and ensure they have expected keys

      let resPost;
      return chai.request(app)
        .get('/posts')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.lengthOf.at.least(1);

          res.body.forEach(function (post) {
            post.should.be.a('object');
            post.should.include.keys('id', 'date', 'timeOfDay', 'species', 'activity', 'location');
          });
          // just check one of the posts that its values match with those in db
          // and we'll assume it's true for rest
          resPost = res.body[0];
          return AnimalTracker.findById(resPost.id);
        })
        .then(post => {
          resPost.date.should.equal(post.date);
          resPost.timeOfDay.should.equal(post.timeOfDay);
          resPost.species.should.equal(post.species);
          resPost.activity.should.equal(post.activity);
          resPost.location.should.equal(post.location);
        });
    });
  });

  describe('POST endpoint', function () {
    // strategy: make a POST request with data,
    // then prove that the post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new blog post', function () {

      const newPost = {
        date: 'nov',
        timeOfDay: 'day',
        species: 'deer',
        activity: 'eating',
        location: 'hills'
      };

      return chai.request(app)
        .post('/posts')
        .send(newPost)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'id', 'date', 'timeOfDay', 'species', 'activity', 'location');
          res.body.date.should.equal(newPost.date);
          // cause Mongo should have created id on insertion
          res.body.id.should.not.be.null;
          res.body.timeOfDay.should.equal(newPost.timeOfDay);
          res.body.species.should.equal(newPost.species);
          res.body.activity.should.equal(newPost.activity);
          res.body.location.should.equal(newPost.location);
          return AnimalTracker.findById(res.body.id);
        })
        .then(function (post) {
          post.date.should.equal(newPost.date);
          post.timeOfDay.should.equal(newPost.timeOfDay);
          post.species.should.equal(newPost.species);
          post.activity.should.equal(newPost.activity);
          post.location.should.equal(newPost.location);
        });
    });
  });

  describe('PUT endpoint', function () {

    // strategy:
    //  1. Get an existing post from db
    //  2. Make a PUT request to update that post
    //  4. Prove post in db is correctly updated
    it('should update fields you send over', function () {
      const updateData = {
        date: 'dec',
        timeOfDay: 'night',
        species: 'coyote',
        activity: 'hunting',
        location: 'canyon'
        }
      ;

      return AnimalTracker
        .findOne()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
            .put(`/posts/${post.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return AnimalTracker.findById(updateData.id);
        })
        .then(post => {
          post.date.should.equal(updateData.date);
          post.timeOfDay.should.equal(updateData.timeOfDay);
          post.species.should.equal(updateData.species);
          post.activity.should.equal(updateData.activity);
          post.location.should.equal(updateData.location);
        });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a post
    //  2. make a DELETE request for that post's id
    //  3. assert that response has right status code
    //  4. prove that post with the id doesn't exist in db anymore
    it('should delete a post by id', function () {

      let post;

      return AnimalTracker
        .findOne()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/posts/${post.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return AnimalTracker.findById(post.id);
        })
        .then(_post => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_post.should.be.null` would raise
          // an error. `should.be.null(_post)` is how we can
          // make assertions about a null value.
          should.not.exist(_post);
        });
    });
  });

//});
