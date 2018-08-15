
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

    function initCarousel() {
        let numSlides = 1
        if ($(window).width() >= 647) {
            numSlides = 2
        }
        if ($(window).width() >= 1024) {
            numSlides = 3
        }
        console.log('#slides', numSlides)

        $('#image-carousel').slick({
            adaptiveHeight: true,
            accessibility: false,
            arrows: false,
            lazyLoad: 'ondemand',
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: numSlides,
            centerMode: true,
            // variableWidth: true,
            autoplay: true,
            autoplaySpeed: 2000,
        });
    }

    initCarousel()

    $(window).on('resize', () => {
        $('#image-carousel').slick('unslick')
        initCarousel()
    })


})
