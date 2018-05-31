// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_STATUS_UPDATES = {
    "statusUpdates": [
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
        {
            "id": "333333",
            "date": "4/15/18",
            "timeOfDay": "Noon",
            "species": "Rattlesnake",
            "activity": "Sunning",
            "location": "Creek",
            "publishedAt": 1470011976609
        },
        {
            "id": "4444444",
            "date": "5/2/18",
            "timeOfDay": "Late afternoon",
            "species": "Bobcat",
            "activity": "Hunting",
            "location": "Hills",
            "publishedAt": 1470009976609
        }
    ]
};

function routeTo(pageID, callbackFn) {
    debugger
    $('.app-page').hide()
    $(`#${pageID}`).show()
    callbackFn()
}

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentStatusUpdates(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function () { callbackFn(MOCK_STATUS_UPDATES) }, 1);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (index in data.statusUpdates) {
        $('body').append(
            '<div class="tracker-data">' +
            '<p>' + "Date:" + " " + data.statusUpdates[index].date + '</p>' +
            '<p>' + "Time of  Day:" + " " + data.statusUpdates[index].timeOfDay + '</p>' +
            '<p>' + "Species:" + " " + data.statusUpdates[index].species + '</p>' +
            '<p>' + "Activity:" + " " + data.statusUpdates[index].activity + '</p>' +
            '<p>' + "Location:" + " " + data.statusUpdates[index].location + '</p>' +
            '</div>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displayStatusUpdates);
}

const LOGIN_FORM_ID = 'login-form'
const LOGIN_URL = '/auth/login'
const PROFILE_URL = '/users/profile'
// const PROFILE_URL = '/auth/refresh-auth-token'
let JWT_TOKEN = null


const authAjaxOptions = {
    beforeSend: (request) => {

        request.setRequestHeader('Authorization', `Bearer: ${JWT_TOKEN}`)
    }
}

function displayProfile(user) {
    // debugger
    $('#users-profile .info').html('<h2>' + 'My tracks:' + '</h2>')
    getAndDisplayStatusUpdates()
}


const setupLogin = () => {
    $(`#${LOGIN_FORM_ID}`).on('submit', ev => {
        ev.preventDefault()
        const requestData = {
            emailAddress: $('input[name="emailAddress"]').val(),
            password: $('input[name="password"]').val(),
        }

        const loginPromise = $.ajax({
            url: LOGIN_URL,
            type: 'POST',
            data: JSON.stringify(requestData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        });
        loginPromise.then(loginResponse => {

            console.log(
                'Yay, got a token:',
                loginPromise.responseJSON.authToken
            )

            JWT_TOKEN = loginPromise.responseJSON.authToken


            $.ajax({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT_TOKEN}`
                },
                dataType: "json",
                url: PROFILE_URL,
                beforeSend: authAjaxOptions.setRequestHeader
            }).then(response => {
                    console.log('GOT PROFILE')
                    routeTo('users-profile', ()=>displayProfile(response))
                })
                .catch(err => {
                    console.error('Bummer!')
                })

        })

        loginPromise.catch(err => {
            console.log('COULD NOT LOGIN, HTTP CODE', err.status)
        })

        console.log('FORM DATA', requestData)
    })
}

//  on page load do this
$(function () {

    setupLogin()
 //   getAndDisplayStatusUpdates()
    routeTo('users-login', ()=>{})
})


