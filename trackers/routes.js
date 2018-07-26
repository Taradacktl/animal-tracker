
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const router = express.Router();
const { AnimalTracker } = require('./model')
const { User } = require('../users/model')
const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false });

// get a list of trackers for the logged in user
router.get('/', jwtAuth, async (req, res) => {

    //at this point we're authenticated and req.user holds the mongoose user record

    console.log("Getting trackers for %s", req.user.emailAddress)

    const user = await User.findOne({emailAddress: req.user.emailAddress})

    const getTrackersP = AnimalTracker.find({user_id:user._id})
    getTrackersP.then(trackers => {
        console.log("Got %d tracker(s)", trackers.length)
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

    newTrackerP.then(tracker => {
        res.status(200).json(tracker.serialize())
    }).catch(err => {
        res.status(500).json({ error: err.toString() })
    })
});

router.delete('/:id', jwtAuth, (req, res) => {
    AnimalTracker.findByIdAndRemove(req.params.id).then(trackers => {
        res.status(204).json({})
    }).catch(err => {
        res.status(500).json({ error: err.toString() })
    })
});

router.put('/:id', jwtAuth, jsonParser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message =
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.id}) must match`;
		console.error(message);
		return res.status(400).json({message: message});
	}
   
	AnimalTracker.findByIdAndUpdate(req.params.id, req.body)
		.then(tracker => res.status(204).json({}))
        .catch(err => {res.status(500).json({error: err.toString() })
    });
});
module.exports = { router };
