  'use strict';

const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

const animalTrackerSchema = new mongoose.Schema({
  date: { type: String, required: true},
  timeOfDay: { type: String, required: true },
  species: { type: String, required: true },
  activity: { type: String, required: true },

  
  //location: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },

  user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});


animalTrackerSchema.methods.serialize = function() {
  return {
    id: this._id,
    date: this.date,
    timeOfDay: this.timeOfDay,
    species: this.species,
    activity: this.activity,
    lat: parseFloat(this.lat),
    lng: parseFloat(this.lng),
  };
};

const AnimalTracker = mongoose.model('AnimalTracker', animalTrackerSchema);

module.exports = { AnimalTracker }; 
