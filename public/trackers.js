const TRACKER_FORM_ID = 'tracker-add-form'
const TRACKS = 'tracks'
var MOCK_STATUS_UPDATES = {
    "trackingRecords": [
        {
            "id": "1111111",
            "date": "3/10/18",
            "timeOfDay": "Midday",
            "species": "Deer",
            "activity": "Napping",
            "location": "Canyon",
            "publishedAt": 1470016976609
        },
        {
            "id": "2222222",
            "date": "4/5/18",
            "timeOfDay": "Late afternoon",
            "species": "Coyote",
            "activity": "Hunting",
            "location": "Mountains",
            "publishedAt": 1470012976609
        },
    ]
}

function displayTracker(tracker) {
    return `
    <div id="tracks">
	    <p>${tracker.id}</p>
        <p>${tracker.date}</p>
        <p>${tracker.timeOfDay}</p>
        <p>${tracker.species}</p>
        <p>${tracker.activity}</p>
        <p>${tracker.location}</p>
        <button type="submit">Edit</button>
        <button type="submit">Delete</button>
    </div>    
    `
}

function displayTrackerList() {
    const trackersPromise = getTrackersPromise()
    return trackersPromise.then(trackers => {
        const htmlString = trackers.map(displayTracker).join(' ')
        $(`#${TRACKERS_DIV_ID} .js-container`).html(htmlString)
    }).catch(err => {
        //TODO display a nice message div
        console.error('DISPLAY TRACKERS FAILED')
    })
}

function getTrackersPromise() {

    return $.ajax({
        url: TRACKERS_URL,
        type: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWT_TOKEN}`
        },
        dataType: 'json',
    }).then(trackers => {
        return trackers
    })

}


function addTrackerPromise(trackerRecord) {

    return $.ajax({
        url: TRACKERS_URL,
        type: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWT_TOKEN}`
        },
        data: JSON.stringify(trackerRecord),
        dataType: 'json',
    }).then(trackers => {
        return true
    })
}

function setupAddTrackerForm() {
    $(`#${TRACKER_FORM_ID}`).on('submit', ev => {
        ev.preventDefault()
        console.log('TRACK ADD SUBMIT')

        //split the string into an array, the boundary is a whitespace character
        const inputNames = 'date timeOfDay activity species location'.split(' ')

        const trackerRecord = {}
        inputNames.forEach(inputName => {
            const inputSelector = `#${TRACKER_FORM_ID} input[name="${inputName}"]`
            trackerRecord[inputName] = $(inputSelector).val()
        })

        addTrackerPromise(trackerRecord)
            .then(() => {
                return displayTrackerList()
            }).catch(err => {
                //TODO display a nice message div
                console.error('ADD TRACK FAILED')
            })

    })
}
/*
function deleteTrackPromise(){
    return $.ajax({
        url: TRACKERS_URL,
        type: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWT_TOKEN}`
        },
        data: JSON.stringify(trackerRecord),
        dataType: 'json',
    }).then(trackers => {
        return true
    })
}

function setupDeleteTrack() {
    $(`#${TRACKS}`).on('submit', ev => {
        ev.preventDefault()
        console.log('TRACK DELETE SUBMIT')

        //split the string into an array, the boundary is a whitespace character
        const inputNames = 'date timeOfDay activity species location'.split(' ')

        const trackerRecord = {}
        inputNames.forEach(inputName => {
            const inputSelector = `#${TRACKER_FORM_ID} input[name="${inputName}"]`
            trackerRecord[inputName] = $(inputSelector).val()
        })

       deleteTrackPromise(trackerRecord)
            .then(() => {
                return displayTrackerList()
            }).catch(err => {
                //TODO display a nice message div
                console.error('DELETE TRACK FAILED')
            })

    })
}
*/