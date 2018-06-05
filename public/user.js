
function apiLoginPromise(emailAddress, password) {
    return $.ajax({
        url: LOGIN_URL,
        type: 'POST',
        data: JSON.stringify({ emailAddress, password }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).then(loginResponse => {
        // debugger
        JWT_TOKEN = loginResponse.authToken
        return JWT_TOKEN
    })
}

const setupLoginButton = () => {
    $(`#${LOGIN_FORM_ID}`).on('submit', ev => {
        ev.preventDefault()
        const formData = {
            emailAddress: $('input[name="emailAddress"]').val(),
            password: $('input[name="password"]').val(),
        }
        apiLoginPromise(formData.emailAddress, formData.password)
            .then(
                () => {
                    routeTo(TRACKERS_DIV_ID)
                    return displayTrackerList()
                })
            .catch(err => {

                //TODO display a nice message div
                console.error('LOGIN FAILED')
            })

    })
}




