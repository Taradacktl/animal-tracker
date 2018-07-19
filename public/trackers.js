const TRACKER_FORM_ID = 'tracker-add-form'
const EDIT_TRACK_FORM_ID = 'tracker-edit-form'
const TRACKS = 'tracks'
// var MOCK_STATUS_UPDATES = {
//     "trackingRecords": [
//         {
//             "id": "1111111",
//             "date": "3/10/18",
//             "timeOfDay": "Midday",
//             "species": "Deer",
//             "activity": "Napping",
//             "location": "Canyon",
//             "publishedAt": 1470016976609
//         },
//         {
//             "id": "2222222",
//             "date": "4/5/18",
//             "timeOfDay": "Late afternoon",
//             "species": "Coyote",
//             "activity": "Hunting",
//             "location": "Mountains",
//             "publishedAt": 1470012976609
//         },
//     ]
// }

function displayTracker(tracker) {
    return `
    <div id="tracks">
	    <p>Track id: ${tracker.id}</p>
        <p>Date: ${tracker.date}</p>
        <p>Time of day: ${tracker.timeOfDay}</p>
        <p>Species: ${tracker.species}</p>
        <p>Activity: ${tracker.activity}</p>
        <p>Location: lat: ${tracker.lat} long: ${tracker.lng}</p>
        <!-- <button type="submit">Edit</button> -->
        <button class="js-edit-tracker" data-id="${tracker.id}">Edit</button>
        <button class="js-delete-tracker" data-id="${tracker.id}">Delete</button>
    </div>    
    `
}

function displayTrackerList() {
    const trackersPromise = getTrackersPromise()
    return trackersPromise.then(trackers => {
        const htmlString = trackers.map(displayTracker).join(' ')
        $(`#${TRACKERS_DIV_ID} .js-container`).html(htmlString)
    }).catch(displayErrorToaster)
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
        TRACKERS = trackers
        return trackers
    })

}

function deleteTrackerPromise(id) {

    return $.ajax({
        url: `${TRACKERS_URL}/${id}`,
        type: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWT_TOKEN}`
        },
        // data:JSON.stringify({id}),
        dataType: 'json',
    }).then(trackers => {
        return true
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
        const inputNames = 'date timeOfDay activity species lat lng'.split(' ')

        const trackerRecord = {}
        inputNames.forEach(inputName => {
            const inputSelector = `#${TRACKER_FORM_ID} input[name="${inputName}"]`
            trackerRecord[inputName] = $(inputSelector).val()
        })

        addTrackerPromise(trackerRecord)
            .then(() => {
                return displayTrackerList().then(() => {
                    displaySuccessToaster('Tracker added')
                    // document.getElementById(TRACKER_FORM_ID).reset()
                    $(`#${TRACKER_FORM_ID}`)[0].reset()

                })
            }).catch(() => displayErrorToaster(createError('Network error, check your connection')))

    })
}

function setupDeleteTrackLinks() {

    $('body').on('click', '.js-delete-tracker', ev => {
        ev.preventDefault()
        const response = confirm('Confirm delete?')
        if (response !== true) {
            return
        }
        const idToDelete = $(ev.target).data('id')
        deleteTrackerPromise(idToDelete)
            .then(displayTrackerList)
            .then(() => displaySuccessToaster('Tracker deleted'))
            .catch(displayErrorToaster)
    })
}

function setupEditTrackLinks() {

    $('body').on('click', '.js-edit-tracker', ev => {
        ev.preventDefault()
        const id = $(ev.target).data('id')
        console.log("Editing tracker %s", id)
        const trackerRecord = TRACKERS.find(i => i.id === id)
        console.log("Editing tracker record:", trackerRecord)
        for (let k in trackerRecord) {

            const inputSelector = `#${EDIT_TRACK_FORM_ID} input[name='${k}']`

            //set the value for the input to the value found in the recordObj
            $(inputSelector).val(trackerRecord[k])

            // console.log("key: %s, value: %s, selector: %s", k, trackerRecord[k], inputSelector)
        }
        $(`#${EDIT_TRACK_FORM_ID} input[name='id']`).val(id)
        routeTo(EDIT_DIV_ID)
    })
}

function setupEditTrack() {
    $(`#${EDIT_TRACK_FORM_ID}`).on('submit', ev => {
        ev.preventDefault()
        console.log('TRACK edit SUBMIT')

        //split the string into an array, the boundary is a whitespace character
        const inputNames = 'date timeOfDay activity species lat lng id'.split(' ')

        const trackerRecord = {}
        inputNames.forEach(inputName => {
            const inputSelector = `#${EDIT_TRACK_FORM_ID} input[name="${inputName}"]`
            trackerRecord[inputName] = $(inputSelector).val()
        })
        console.log('Updated tracker:', trackerRecord)

        editTrackerPromise(trackerRecord)
            .then(displayTrackerList)
            .then(() => {
                displaySuccessToaster('Tracker updated')
                 routeTo(TRACKERS_DIV_ID)
                
            })
            .catch(displayErrorToaster)

    })
}

function editTrackerPromise(trackerRecord) {
    return $.ajax({
        url: `${TRACKERS_URL}/${trackerRecord.id}`,
        type: 'PUT',
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

function datePicker(){
    $('.flatpickr').flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    })
}

function timePicker(){
    $('.timepickr').flatpickr({ 
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
    })
}