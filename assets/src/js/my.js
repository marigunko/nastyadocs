//Menu active link
$(function() {
  $('.navbar__nav [href]').each(function() {
    if (this.href == window.location.href) {
      $(this).addClass('active');
    }
  });
});

//Slider Menu
jQuery(document).ready(function($) {

	'use strict';

    var top_header = $('.parallax-content');
    top_header.css({'background-position':'center center'}); // better use CSS

    $(window).scroll(function () {
    var st = $(this).scrollTop();
    top_header.css({'background-position':'center calc(50% + '+(st*.5)+'px)'});
    });


    $('body').scrollspy({ 
        target: '.fixed-side-navbar',
        offset: 200
    });
      
      // smoothscroll on sidenav click

    $('.tabgroup > div').hide();
        $('.tabgroup > div:first-of-type').show();
        $('.tabs a').click(function(e){
          e.preventDefault();
            var $this = $(this),
            tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
            others = $this.closest('li').siblings().children('a'),
            target = $this.attr('href');
        others.removeClass('active');
        $this.addClass('active');
        $(tabgroup).children('div').hide();
        $(target).show();
      
    })

});

$(document).ready(function(){
    // Add smooth scrolling to all links
    $(".fixed-side-navbar a, .primary-button a").on('click', function(event) {

      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 800, function(){
     
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        });
      } // End if
    });
  });


//Fix tab-pane height
var maxHeight = 0;
 
$(".about__tab-pane--fixed").each(function(){
  if ( $(this).height() > maxHeight ) 
  {
    maxHeight = $(this).height();
  }
});
 
$(".about__tab-pane--fixed").height(maxHeight);

$(window).resize(function(){ 
});


//Slider
$(function(){
  $('.reviews__sl').slick({
    autoplay: true,
    dots: true,
    pauseOnDotsHover: true,
    slidesToShow: 2,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1,
      }
    },
  ]
  });
});

$(function(){
  $('.blog__sl').slick({
    autoplay: false,
    slidesToShow: 3,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      }
    },
  ]
  });
});

$(function(){
  $('.profit__sl').slick({
    autoplay: false,
    dots: true,
    pauseOnDotsHover: true,
    slidesToShow: 1,
  });
});

$(function(){
  $('.bookstore__sl').slick({
    autoplay: true,
    slidesToShow: 4,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
      }
    },
  ]
  });
});

$(function(){
  $('.news__sl').slick({
    dots: true,
    slidesToShow: 1,
  });
});

//Slider
$(function(){
  $('.articles__sl').slick({
    dots: true,
    slidesToShow: 3,
    responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1,
      }
    },
  ]
  });
});


//Img in horizontal card
(function ($) {
  $.fn.coverImage = function(contain) {
    this.each(function() {
      var $this = $(this),
        src = $this.get(0).src,
        $wrapper = $this.parent();

      if (contain) {
        $wrapper.css({
          'background': 'url(' + src + ') 50% 50%/contain no-repeat/'
        });
      } else {
        $wrapper.css({
          'background': 'url(' + src + ') 50% 50%/cover no-repeat'
        });
      }

      $this.remove();
    });

    return this;
  };
})(jQuery);

jQuery('.cover-image').coverImage();
