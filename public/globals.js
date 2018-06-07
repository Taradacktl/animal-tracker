const LOGIN_FORM_ID = 'login-form'

const LOGIN_URL = '/auth/login'
const LOGIN_DIV_ID = 'users-login' //profile div id

const PROFILE_URL = '/users/profile'
const PROFILE_DIV_ID = 'users-profile' //profile div id

const TRACKERS_URL = '/trackers'
const TRACKERS_DIV_ID = 'trackers-page'

const SIGNUP_DIV_ID = 'users-signup'

// const PROFILE_URL = '/auth/refresh-auth-token'
let JWT_TOKEN = null

// this hides all page containers and only shows the one with the given id
function routeTo(pageID) {
    //    debugger
    $('.app-page').hide()
    $(`#${pageID}`).show()

}
