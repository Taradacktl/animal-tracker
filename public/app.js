// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_STATUS_UPDATES = {
	"statusUpdates": [
        {
            "id": "1111111",
            "Date": "3'/'10'/'18",
            "TimeOfDay": "Midday",
            "species": "Deer",
            "activity": "Napping",
            "location": "Canyon",
            "publishedAt": 1470016976609
        },
        {
            "id": "2222222",
            "Date": "4-5-18",
            "TimeOfDay": "Late afternoon",
            "species": "Coyote",
            "activity": "Hunting",
            "location": "Mountains",
            "publishedAt": 1470012976609
        },
        {
            "id": "333333",
            "Date": "4/15/18",
            "TimeOfDay": "Noon",
            "species": "Rattlesnake",
            "activity": "Sunning",
            "location": "Creek",
            "publishedAt": 1470011976609
        },
        {
            "id": "4444444",
            "Date": "5/2/18",
            "TimeOfDay": "Late afternoon",
            "species": "Bobcat",
            "activity": "Hunting",
            "location": "Hills",
            "publishedAt": 1470009976609
        }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentStatusUpdates(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_STATUS_UPDATES)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (index in data.statusUpdates) {
	   $('body').append(
        '<p>' + "Date:" + " " + data.statusUpdates[index].date + '</p>' +
        '<p>' + "Time of Day:" + " " + data.statusUpdates[index].timeOfDay + '</p>' +
        '<p>' + "Species:" + " " + data.statusUpdates[index].species + '</p>' +
        '<p>' + "Activity:" + " " + data.statusUpdates[index].activity + '</p>' +
        '<p>' + "Location:" + " " + data.statusUpdates[index].location + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
	getRecentStatusUpdates(displayStatusUpdates);
}

//  on page load do this
$(function() {
	getAndDisplayStatusUpdates();
})