var TRACKERS = [] //keep trackers in a global var to make them available for edit

const MAIN_NAV_ID = 'myDropdown'

const LOGIN_FORM_ID = 'login-form'

const LOGIN_URL = '/auth/login'
const LOGIN_DIV_ID = 'users-login' //profile div id

const PROFILE_URL = '/users/profile'
const PROFILE_DIV_ID = 'users-profile' //profile div id

const TRACKERS_URL = '/trackers'
const TRACKERS_DIV_ID = 'trackers-page'

const EDIT_DIV_ID = 'edit-trackers-page'

const SIGNUP_URL = 'users/create'
const SIGNUP_DIV_ID = 'users-signup'

const SIGNUP_FORM_ID = 'signup-form'
const CHANGE_PASSWORD_FORM_ID = 'change-password'

const RESET_URL = 'auth/forgotpassword'
const RESET_PASSWORD_DIV_ID = 'password-reset-page'
const RESET_PASSWORD_FORM_ID = 'password-reset-form'

// const PROFILE_URL = '/auth/refresh-auth-token'
let JWT_TOKEN = null

// this hides all page containers and only shows the one with the given id
function routeTo(pageID) {
    //    debugger
    $('.app-page').hide()
    $(`#${pageID}`).show()

    if (pageID === TRACKERS_DIV_ID) {
        console.log('INIT add form')
        const inputSelector = '#js-create-date-picker'
        var calendar = flatpickr(inputSelector);
        calendar.destroy();
        datePicker(null, inputSelector)
    }

}

function displayErrorToaster(err) {
    console.error(err.toString(), err)
    toastr.clear()
    toastr.error(err.toString(), 'Error')
}

function displaySuccessToaster(message) {
    toastr.remove()
    toastr.success(message, 'Info')
}


function createError(message) {
    return new Error(message)
}
