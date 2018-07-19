
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
    datePicker()
    timePicker()
    setupEditTrack()
    setupAddTrackerForm()
    setupEditTrackLinks()
    setupDeleteTrackLinks()

    //profile stuff
    setupChangePassword()

    toastr.options.preventDuplicates = true;
    //jquery: display toasters when performing AJAX
    $.ajaxSetup({
        complete: () => { 
            // toastr.remove(); 
            // toastr.info('Completed'); 
        },
       // beforeSend: () => { toastr.info('Please wait...'); },
    })
})
