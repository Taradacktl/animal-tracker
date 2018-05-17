/* const uuid = require('uuid');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const AnimalTracker = {
  create: function(date, timeOfDay, species, activity, location) {
    console.log('Creating new post');

    const item = {
      date: date,
      id: uuid.v4(),
      timeOfDay: timeOfDay,
      species: species,
      activity: activity,
      location: location,
    };
    this.items[item.id] = item;
    return item;
  },
  get: function() {
    console.log('Retrieving post');
    return Object.keys(this.items).map(key => this.items[key]);
  },
  delete: function(id) {
    console.log(`Deleting post \`${id}\``);
    delete this.items[id];
  },
  update: function(updatedItem) {
    console.log(`Deleting post \`${updatedItem.id}\``);
    const {id} = updatedItem;
    if (!(id in this.items)) {
      throw StorageException(
        `Can't update post \`${id}\` because doesn't exist.`)
    }
    this.items[updatedItem.id] = updatedItem;
    return updatedItem;
  }
};

function createAnimalTracker() {
  const storage = Object.create(AnimalTracker);
  storage.items = {};
  return storage;
}
module.exports = {
    AnimalTracker: createAnimalTracker(),
  }
*/

  'use strict';

const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

const animalTrackerSchema = new mongoose.Schema({
  date: { type: String, required: true},
  timeOfDay: { type: String, required: true },
  species: { type: String, required: true },
  activity: { type: String, required: true },
  location: { type: String, required: true },
});


animalTrackerSchema.methods.serialize = function() {
  return {
    id: this._id,
    date: this.date,
    timeOfDay: this.timeOfDay,
    species: this.species,
    activity: this.activity,
    location: this.location
  };
};

const AnimalTracker = mongoose.model('AnimalTracker', animalTrackerSchema);

module.exports = { AnimalTracker }; 
