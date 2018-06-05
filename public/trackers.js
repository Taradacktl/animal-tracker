const TRACKER_FORM_ID = 'tracker-add-form'

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
    <div>
	    <p>${tracker.id}</p>
	    <p>${tracker.species}</p>
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

    //TODO replace this with an API call
    // return Promise.resolve(MOCK_STATUS_UPDATES.trackingRecords)

    return new Promise((resolve, reject) => {
        const resolver = () => resolve(MOCK_STATUS_UPDATES.trackingRecords)
        window.setTimeout(resolver, 5000)
    })
}


function addTrackerPromise(trackerRecord) {

    //TODO replace this with an API call
    MOCK_STATUS_UPDATES.trackingRecords.unshift(trackerRecord)
    return Promise.resolve(true)
}

function setupAddTrackerForm() {
    $(`#${TRACKER_FORM_ID}`).on('submit', ev => {
        ev.preventDefault()
        console.log('TRACKER ADD SUBMIT')

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
                console.error('ADD TRACKER FAILED')
            })

        // debugger

    })
}

