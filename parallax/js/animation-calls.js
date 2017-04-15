/**
 * Created by Nate on 4/11/2017.
 */


$(document).ready(function() {
     loadParallaxEffect();

    // don't allow scrolling on map
    var map = $('iframe');
    map.attr('scrolling','no');
    map.attr('border','none');


    $( ".accordion" ).accordion({
        collapsible: true,
        heightStyle: 'content'
    });




});



function loadParallaxEffect() {
    var parallax = document.querySelectorAll(".parallax"),
        speed = 0.5;

    window.onscroll = function(){
        [].slice.call(parallax).forEach(function(el,i){

            var windowYOffset = window.pageYOffset,
                elBackgrounPos = "50% " + (windowYOffset * speed) + "px";

            el.style.backgroundPosition = elBackgrounPos;

        });

    };
}

function fadeIn(name,direction) {
    $(name).animsition({
        inClass: 'fade-in-'+ direction +'-sm',
        outClass: 'fade-out-'+ direction +'-sm',
        inDuration: 900,
        outDuration: 800,
        linkElement: '.animsition-link',
        // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
        loading: true,
        loadingParentElement: 'body', //animsition wrapper element
        loadingClass: 'animsition-loading',
        loadingInner: '', // e.g '<img src="loading.svg" />'
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
        // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'body',
        transition: function(url){ window.location.href = url; }
    });
}

// fade in effect
$(window).on("load",function() {
    var every_other = true;
    $(window).scroll(function() {
        var windowBottom = $(this).scrollTop() + $(this).innerHeight();
        $(".module.content").each(function() {
            /* Check the location of each desired element */
            var objectBottom = $(this).offset().top + $(this).outerHeight();

            /* If the element is completely within bounds of the window, fade it in */
            if (objectBottom/1.5 < windowBottom) { //object comes into view (scrolling down)
                if ($(this).css("opacity")==0) {
                    $(this).fadeTo(500,1);
                }

            }
        });
    }).scroll(); //invoke scroll-handler on page-load
});


$('.person-wrapper').matchHeight(
    {
        byRow: true,
        property: 'height',
        target: null,
        remove: false
    }
);



