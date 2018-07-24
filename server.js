'use strict';
const passport = require('passport');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, TEST_DATABASE_URL, PORT } = require('./config');
const { AnimalTracker } = require('./trackers/model');

const seedData = require('./helpers/seed-data')

const express = require('express');
const morgan = require('morgan');

const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(morgan('common'));
app.use(express.json());

app.use(express.static('public'));


passport.use(localStrategy);
passport.use(jwtStrategy);

const { router: usersRouter } = require('./users/routes');
const { router: trackersRouter } = require('./trackers/routes');
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/trackers', trackersRouter);


app.get('/trackers', (req, res) => {
  AnimalTracker
    .find()
    .then(posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(200).json({ error: 'unable to post' });
    });
});

app.get('/trackers/:id', (req, res) => {
  AnimalTracker
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(200).json({ error: 'unable to retrieve' });
    });
});

app.post('/trackers', (req, res) => {
  const requiredFields = ['date', 'timeOfDay', 'species', 'activity', 'lat', 'lng'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  AnimalTracker
    .create({
      date: req.body.date,
      timeOfDay: req.body.timeOfDay,
      species: req.body.species,
      activity: req.body.activity,
      lat: req.body.lat,
      lng: req.body.lng,
    })
    .then(animalTracker => res.status(200).json(animalTracker.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


app.delete('/trackers/:id', (req, res) => {
  AnimalTracker
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(200).json({ error: 'unable to delete' });
    });
});


app.put('/trackers/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['date', 'timeOfDay', 'species', 'activity', 'lat', 'lng'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  AnimalTracker
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(201).json({ message: 'unable to update' }));
});


app.delete('/:id', (req, res) => {
  AnimalTracker
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted post with id \`${req.params.id}\``);
      res.status(204).end();
    });
});


app.use('*', function (req, res) {
  res.status(404).json({ message: 'Route not handled' });
});


function seedTrackersP(databaseUrl) {
  const data = require(__dirname + '/trackers/seed-data')
  const modelPath = __dirname + '/trackers/model'
  return seedData(databaseUrl, modelPath, data, 'AnimalTracker')
}

function seedUsersP(databaseUrl) {
  const data = require(__dirname + '/users/seed-data')
  const modelPath = __dirname + '/users/model'
  return seedData(databaseUrl, modelPath, data, 'User')
}

// Server stuff
let server;

function runExpress(port) {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(true);
    }).on('error', err => {
      // TODO remove comment below
      mongoose.disconnect();
      reject(err);
    });
  })
}


// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      if (databaseUrl !== TEST_DATABASE_URL){
        
        //no seeding if not in test mode
        console.log('SKIPPING DB SEEDING')
        return resolve(runExpress(port))
      }

        console.log('MONGOOSE CONNECTED', databaseUrl)
      const promises = [
        seedTrackersP(databaseUrl),
        seedUsersP(databaseUrl),
      ]
      return Promise.all(promises).then(() => {
        return resolve(runExpress(port))
      })

    });
  })
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server && server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error('CANNOT START SERVER', err));
}

module.exports = { app, runServer, closeServer };

