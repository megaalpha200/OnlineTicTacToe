/**
 * Created by Jose A. Alvarado on 8/12/2017.
 */

import $ from 'jquery';

var isDisappearing = false;

$(function () {
   //initializeHeader()
});

export function initializeHeader(disappear) {
   isDisappearing = disappear;

   $("#header-img").addClass("animate-transition");
   $("#motto").addClass("animate-transition");
   $(".menu-item").addClass("animate-transition");
   $("#page-title").addClass("animate-transition");
   $("#menu-button").addClass("animate-transition").click(function () {
       $("#menu-full").slideToggle(500);
   });

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
}

export function resizeHeaderBasedOnScroll() {
   const scrollVal = $(document).scrollTop();
   if (scrollVal > 100) {
       $("header").addClass("shrink-header");

       if (isDisappearing) {
           $("header").addClass("disappear-header");
       }
   }
   else if (scrollVal < 100) {
       $("header").removeClass("shrink-header");

       if (isDisappearing) {
           $("header").removeClass("disappear-header");
       }
   }

   const isMenuButtonVisible = $("#menu-button").css("display") !== "none";

   if (isMenuButtonVisible) {
       $("#menu-full").slideUp(500);
   }
   else {
       $("#menu-full").slideDown(500); //For precautionary measures
   }
}

export function shrinkHeader() {
   $("header").addClass("shrink-header");

   if (isDisappearing) {
       $("header").addClass("disappear-header");
   }
}