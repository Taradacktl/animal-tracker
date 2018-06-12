
//main
$(() => {
    console.log('Init APP')

    //user stuff
    setupLoginButton()
    setupLogoutButton()
    routeTo(LOGIN_DIV_ID)

    restoreLogin()

    setupSignUpButton()
    setupRouteHandlers()
    // routeTo(SIGNUP_DIV_ID)

    //tracker stuff
    setupAddTrackerForm()
    setupDeleteTrack()
    //profile stuff

})
