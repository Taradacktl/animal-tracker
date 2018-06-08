
//main
$(() => {
    console.log('Init APP')

    //user stuff
   setupLoginButton()
   routeTo(LOGIN_DIV_ID)

 setupSignUpButton()
 setupRouteHandlers()
 // routeTo(SIGNUP_DIV_ID)

    //tracker stuff
    setupAddTrackerForm()
    setupDeleteTrack()
    //profile stuff

})
