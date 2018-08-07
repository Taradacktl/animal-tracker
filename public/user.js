
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
        saveToken()
        return JWT_TOKEN
    })
}


function saveToken() {
    Cookies.set('APP_LOGIN_TOKEN', JWT_TOKEN);
}
function getToken() {
    return Cookies.set('APP_LOGIN_TOKEN');
}

function isLoggedIn() {
    return !!JWT_TOKEN
}

function restoreLogin() {
    const existingToken = getToken()
    if (existingToken) {
        $(`#${MAIN_NAV_ID}`).removeClass('js-logged-out')
        JWT_TOKEN = existingToken
        routeTo(TRACKERS_DIV_ID)
        return displayTrackerList()
    }
}

function logout() {
    Cookies.remove('APP_LOGIN_TOKEN')
    JWT_TOKEN = null
    $(`#${MAIN_NAV_ID}`).addClass('js-logged-out')
}

const setupLogoutButton = () => {

    $('body').on('click', '.js-route-logout', ev => {
        ev.preventDefault()
        logout()
        routeTo(LOGIN_DIV_ID)
    })
}

const setupLoginButton = () => {
    $(`#${LOGIN_FORM_ID}`).on('submit', ev => {
        // debugger
        ev.preventDefault()
        const formData = {
            emailAddress: $('input[name="emailAddress"]').val(),
            password: $('input[name="password"]').val(),
        }
        apiLoginPromise(formData.emailAddress, formData.password)
            .then(
                () => {
                    $(`#${MAIN_NAV_ID}`).removeClass('js-logged-out')
                    document.getElementById(LOGIN_FORM_ID).reset()
                    routeTo(TRACKERS_DIV_ID)
                    return displayTrackerList()
                })
            .catch(() => displayErrorToaster(createError('Must provide valid email and password')))
        //TODO display a nice message div
        console.error('LOGIN FAILED')
    })
}

//TODO 6/7 create a new user with email address and password
function apiSignupPromise(emailAddress, password) {
    return $.ajax({
        url: SIGNUP_URL,
        type: 'POST',
        data: JSON.stringify({ emailAddress, password }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).then(signupResponse => {
        // debugger
        JWT_TOKEN = signupResponse.authToken
        return JWT_TOKEN
    })
}

function apiChangePasswordPromise(newPassword, retypeNewPassword) {
    return $.ajax({
        url: '/auth/changepassword',
        type: 'POST',
        data: JSON.stringify({ newPassword, retypeNewPassword }),
        // contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JWT_TOKEN}`
        },
    }).then(changepasswordResponse => {
        // debugger
        JWT_TOKEN = changepasswordResponse.authToken
        return JWT_TOKEN
    })
}

const setupRouteHandlers = () => {
    $('.js-route-signup').on('click', ev => {
        ev.preventDefault()
        document.getElementById(LOGIN_FORM_ID).reset()
        routeTo(SIGNUP_DIV_ID)
    })
    $('.js-route-login').on('click', ev => {
        ev.preventDefault()
        document.getElementById(SIGNUP_FORM_ID).reset()
        routeTo(LOGIN_DIV_ID)
    })

    //TODO 6/11 make sure user is logged in
    $('.js-route-profile').on('click', ev => {
        ev.preventDefault()
        routeTo(PROFILE_DIV_ID)
    })
}
//TODO 6/14 if passwords dont match error message
const setupSignUpButton = () => {
    $(`#${SIGNUP_FORM_ID}`).on('submit', ev => {
        ev.preventDefault()
        const formData = {
            emailAddress: $('.app-page:visible input[name="emailAddress"]').val(),
            password: $('.app-page:visible  input[name="password"]').val(),
        }

        apiSignupPromise(formData.emailAddress, formData.password)
            .then(
                () => {
                    //  document.getElementById(LOGIN_FORM_ID).reset()
                    routeTo(LOGIN_DIV_ID)
                    // routeTo(TRACKERS_DIV_ID)
                    // return displayTrackerList()
                })
            .catch(() => displayErrorToaster(createError('Must provide a unique email address')))

        //TODO display a nice message div
        console.error('Sign up FAILED')


    })
}

const setupChangePassword = () => {
    $(`#${CHANGE_PASSWORD_FORM_ID}`).on('submit', ev => {
        ev.preventDefault()
        console.log('CLICKED')
        //   const newPassword = `#${CHANGE_PASSWORD_FORM_ID} input[name="${newPassword}"]`
        const newPasswordData = {
            newPassword: $('input[name="newPassword"]').val(),
            retypeNewPassword: $('input[name="retypeNewPassword').val(),
        }

        if (newPasswordData.newPasswordData.length < 4) {
            //TODO display nice toaster
            return
        }

        console.log('PASSWORD:', newPasswordData)

        apiChangePasswordPromise(newPasswordData.newPassword, newPasswordData.retypeNewPassword)
            .then(
                () => {
                    $(`#${CHANGE_PASSWORD_FORM_ID}`)[0].reset()
                    logout()
                    routeTo(LOGIN_DIV_ID)
                })
            .catch(() => displayErrorToaster(createError('Password change failed')))

    })

}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function menuFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
    console.log("menu clicked")
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.js-dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

const setupCancelButton = () => {

    $('body').on('click', '.js-route-home', ev => {
        ev.preventDefault()
        routeTo(TRACKERS_DIV_ID)
    })
}