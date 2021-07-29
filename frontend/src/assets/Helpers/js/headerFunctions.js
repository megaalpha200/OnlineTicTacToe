/**
 * Created by Jose A. Alvarado on 8/12/2017.
 */

import $ from 'jquery';

var isDisappearing = false;
var isShrunk = false;

$(function () {
   //initializeHeader()
});

export function initializeMarquee() {
    $(".marquee").addClass("animate-transition");
    $(".marquee p").addClass("animate-transition");
}

export function initializeHeader(disappear) {
   isDisappearing = disappear;

   $("#header-img").addClass("animate-transition");
   $("#motto").addClass("animate-transition");
   $(".menu-item").addClass("animate-transition");
   $("#page-title").addClass("animate-transition");
   $("#menu-button").addClass("animate-transition");

   resizeHeaderBasedOnScroll();
   $(document).on("scroll", resizeHeaderBasedOnScroll);
   $(window).on("resize", resizeHeaderBasedOnScroll);

   $(".sub-menu").on("click mouseleave", function(event) {

       if (event.type === "click") {
           $(this).children(".inner-menu").slideToggle(500);
       }
       else {
           $(this).children(".inner-menu").slideUp(500);
       }
   });

   $("#menu-mobile").slideUp(1);
}

export function resizeHeaderBasedOnScroll() {
   const scrollVal = $(document).scrollTop();
   if (scrollVal > 100) {
       shrinkHeader();
   }
   else if (scrollVal < 100) {
       growHeader();
   }

   const isMenuButtonVisible = $("#menu-button").css("display") !== "none";

   if (isMenuButtonVisible) {
        $("#menu-mobile").slideUp(500);
        $("#menu-mobile").attr("hidden", false);
    }
    else {
        $("#menu-mobile").slideDown(500); //For precautionary measures
        $("#menu-mobile").attr("hidden", true);
    }

    removeTransparentMenuFilm();
}

function addTransparentMenuFilm() { $("#menu-transparent-film").attr("hidden", false); }
function removeTransparentMenuFilm() { $("#menu-transparent-film").attr("hidden", true); }

export function toggleMobileHeader() {
    if($("#menu-mobile").is(":hidden"))
    {
        $("#menu-mobile").slideDown(500);
        addTransparentMenuFilm();
        shrinkHeader();
        return true;
    }
    else {
        $("#menu-mobile").slideUp(500);
        removeTransparentMenuFilm();
        growHeader();
        resizeHeaderBasedOnScroll();
        return false;
    }
}

export function shrinkHeader() {
   $("header").addClass("shrink-header");
   isShrunk = true;

   if (isDisappearing) {
       $("header").addClass("disappear-header");
   }
}

export function growHeader() {
    $("header").removeClass("shrink-header");
    $("header").removeClass("disappear-header");
    isShrunk = false;
}

export function isHeaderShrunk() {
    return isShrunk;
}

export function setHeaderShrinkGrow(isShrunk) {
    if (isShrunk) {
        shrinkHeader();
    }
    else {
        growHeader();
    }
}