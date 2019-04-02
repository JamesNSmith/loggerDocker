// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
// require react
// require react_ujs
// require components
//= require_tree .
//= require jquery
//= require jquery_ujs

$(document).on('turbolinks:load', function() {

  $('.user-button').on('click', () => {
    $('.user-menu').toggleClass('hide');
    $('.user-button').toggleClass('button-active');
  });

  $('.club-button').on('click', () => {
    $('.club-menu').toggleClass('hide');
    $('.club-button').toggleClass('button-active');
  });

  /*$('.user-button').mouseenter(function() {
    $('.user-menu').removeClass('hide');
    $('.user-button').addClass('button-active');
  });

  $('.user-button').mouseleave(function() {
    $('.user-menu').addClass('hide');
    $('.user-button').removeClass('button-active');
  });

  $('.user-menu').mouseenter(function() {
    $('.user-menu').removeClass('hide');
  });

  $('.user-menu').mouseleave(function() {
    $('.user-menu').addClass('hide');
  });*/

  $('.menuChild').mouseenter(function() {
    $(this).addClass('current_page_item');
  });   

  $('.menuChild').mouseleave(function() {
    $(this).removeClass('current_page_item');
  }); 
}); 


//<a href="/" accesskey="1" title="">
