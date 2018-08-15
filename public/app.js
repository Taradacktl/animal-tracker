
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
    initMap()
    setupAddTrackerForm()
    setupEditTrackLinks()
    setupCancelButton2()
    setupDeleteTrackLinks()
    setupCancelButton()
    
    //profile stuff
    setupChangePassword()
    setupResetPassword()

    toastr.options.preventDuplicates = true;
    //jquery: display toasters when performing AJAX
    $.ajaxSetup({
        complete: () => { 
            // toastr.remove(); 
            // toastr.info('Completed'); 
        },
       // beforeSend: () => { toastr.info('Please wait...'); },
    })

    $('#image-carousel').slick({
        lazyLoad: 'ondemand',
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 2,
        centerMode: true,
        variableWidth: true,
        autoplay:true,
        autoplaySpeed: 2000,
      });


})
