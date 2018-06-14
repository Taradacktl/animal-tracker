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
// const PROFILE_URL = '/auth/refresh-auth-token'
let JWT_TOKEN = null

// this hides all page containers and only shows the one with the given id
function routeTo(pageID) {
    //    debugger
    $('.app-page').hide()
    $(`#${pageID}`).show()

}

function displayErrorToaster(err){
    console.error(err.toString(), err)
    toastr.error(err.toString(), 'Error')
}

function displaySuccessToaster(message){    
    toastr.success(message, 'Success')
}


function createError(message){
    return new Error(message)
}
