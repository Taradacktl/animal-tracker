
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { AnimalTracker } = require('./model')


const jwtAuth = passport.authenticate('jwt', { session: false });

// get a list of trackers for the logged in user
router.get('/', jwtAuth, (req, res) => {

    //at this point we're authenticated and req.user holds the mongoose user record

    console.log("Getting trackers for %s", req.user.emailAddress)

    const getTrackersP = AnimalTracker.find({user_id:req.user.id})
    getTrackersP.then(trackers => {
        console.log("Got %d trackers", trackers.length)
        res.json(trackers.map(t => t.serialize()))
    }).catch(err => {
        res.status(500).json({ error: err.toString() })
    })

});

router.get('/:id', jwtAuth, (req, res) => {
    //TODO implement this

});

//the API URL is still /trackers, but the method should be POST
router.post('/', jwtAuth, (req, res) => {
    //TODO implement this
    const newTrackerP = AnimalTracker.create({
        //request fields here
        ...req.body,
        user_id:req.user.id
    })

    newTrackerP.then(trackers => {
        res.status(200).json({})
    }).catch(err => {
        res.status(500).json({ error: err.toString() })
    })
});

router.delete('/:id', jwtAuth, (req, res) => {
    AnimalTracker.findByIdAndRemove(req.params.id).then(trackers => {
        res.status(200).json({})
    }).catch(err => {
        res.status(500).json({ error: err.toString() })
    })
});

module.exports = { router };
