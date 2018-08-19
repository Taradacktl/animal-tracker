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

function getListingID(id) {
    return `tracker-listing-${id}`
}

function displayTracker(tracker) {
    const id = getListingID(tracker.id)
    return `
    <div id="${id}" class="tracker-listing">
	    <p>Track id: ${tracker.id}</p>
        <p>Date: ${tracker.date}</p>
        <p>Time of day: ${tracker.timeOfDay}</p>
        <p>Species: ${tracker.species}</p>
        <p>Activity: ${tracker.activity}</p>
        <p>Lat: ${tracker.lat}</p>
        <p>Long: ${tracker.lng}</p>
        <!-- <button type="submit">Edit</button> -->
        <button class="js-edit-tracker" data-id="${tracker.id}">Edit</button>
        <button class="js-delete-tracker" data-id="${tracker.id}">Delete</button>
    </div>    
    `
}

function handleMarkerClick(listingID) {
    const listEl = $(`#${listingID}`)

    $('.tracker-container').animate({
        scrollTop: listEl.offset().top
    }, 500);

    $('.tracker-listing').removeClass('tracker-selected')
    $(`#${listingID}`).addClass('tracker-selected')
}
const MARKERS = {}

function displayTrackerList() {
    const trackersPromise = getTrackersPromise()
    return trackersPromise.then(trackers => {

        Object.keys(MARKERS).forEach(trackerID => {
            console.log('DELETE MARKER', trackerID)
            MARKERS[trackerID].setMap(null)
            delete MARKERS[trackerID]
        })

        trackers.forEach(tracker => {
            const { date, timeOfDay, species, activity, lat, lng } = tracker
            const title = `${species} - ${activity} - ${date} - ${timeOfDay}`

            var marker = new google.maps.Marker({
                position: { lat, lng }, //{lat:lat, lng:lng}
                map: MAP,
                title: title,
                draggable: false
            });
            const listingID = getListingID(tracker.id)
            const handler = function () { handleMarkerClick(listingID) }
            marker.addListener('click', handler);
            console.log('ADD MARKER', tracker.id)
            MARKERS[tracker.id] = marker
        })

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
    }).catch(err => {
        console.error('FETCH ERROR', err)
        if (err.status === 401) {
            console.log('Bad token???')
            logout()
            // window.location.reload()
        }
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
            }).catch(() => displayErrorToaster(createError('Must complete form')))

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
            .then(() => {
                displayTrackerList()
            })
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
        // debugger
        const { lat, lng } = trackerRecord
        initMap('map-edit', { lat, lng })
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
            .then(() => {
                displayTrackerList()
            })
            .then(() => {
                displaySuccessToaster('Tracker updated')
                routeTo(TRACKERS_DIV_ID)
                $(`#${TRACKER_FORM_ID}`)[0].reset()
            })
            .catch(() => displayErrorToaster(createError('Must complete form')))

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

function datePicker() {
    $('.flatpickr').flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "m-d-Y",
    })
}

function timePicker() {
    $('.timepickr').flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
    })
}

let MAP
function initMap(id = 'map-create', geoPosition = { lat: 34.0522, lng: -118.2437 }) {

    MAP = new google.maps.Map(document.getElementById(id), {
        zoom: 6,
        center: geoPosition,
        mapTypeId: 'terrain'
    });

    var marker = new google.maps.Marker({
        position: geoPosition,
        label: '*',
        map: MAP,
        title: 'Drag to enter Latitude and Longitude',
        draggable: true,
        icon: pinSymbol('green'),
        zIndex: 100,
    });
    function pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            //  strokeColor: '#000',
            //  strokeWeight: 1,
            // scale: 1
        };
    }


    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((marker), 'dragend', function (event) {
        const coords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        }
        console.log('Pin dropped:', event.latLng.lat(), event.latLng.lng())
        $('input[name="lat"]').val(coords.lat)
        $('input[name="lng"]').val(coords.lng)
    });

}

const setupCancelButton2 = () => {

    $('body').on('click', '.js-route-home', ev => {
        ev.preventDefault()
        $(`#${EDIT_TRACK_FORM_ID}`)[0].reset()
        routeTo(TRACKERS_DIV_ID)
    })
}