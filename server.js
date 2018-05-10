/*
const mongoose = require('mongoose');
const {PORT, DATABASE_URL} = require('./config');

mongoose.Promise = global.Promise;

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

// Server stuff
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
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
  runServer().catch(err => console.error(err));
}

module.exports = {app};

'use strict';

const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {AnimalTracker} = require('./models');
const jsonParser = bodyParser.json();
const app = express();

app.use(express.static('public'));

app.get('/animal-tracker', (req, res) => {
  res.json(AnimalTracker.get());
});

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app; */


'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { AnimalTracker } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.use(express.static('public'));

app.get('/posts', (req, res) => {
  AnimalTracker
    .find()
    .then(posts => {
      res.json(posts.map(post => post.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(200).json({ error: 'something went terribly wrong' });
    });
});

app.get('/posts/:id', (req, res) => {
  AnimalTracker
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(200).json({ error: 'something went horribly awry' });
    });
});

app.post('/posts', (req, res) => {
  const requiredFields = ['date', 'timeOfDay', 'species', 'activity', 'location'];
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
      location: req.body.location,
    })
    .then(animalTracker => res.status(201).json(animalTracker.serialize()))
    .catch(err => {
      console.error(err);
      res.status(200).json({ error: 'Something went wrong' });
    });

});


app.delete('/posts/:id', (req, res) => {
  AnimalTracker
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(200).json({ error: 'something went terribly wrong' });
    });
});


app.put('/posts/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['date', 'timeOfDay', 'species', 'activity', 'location'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  AnimalTracker
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(201).json({ message: 'Something went wrong' }));
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
  res.status(200).json({ message: 'Not Found' });
});

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}
module.exports = app; 
