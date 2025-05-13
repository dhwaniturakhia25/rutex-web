jQuery(document).ready(function ($) {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $("body").addClass("header-fixed");
    } else {
      $("body").removeClass("header-fixed");
    }
  });

  $(".mobile-toggle").click(function () {
    $("body").toggleClass("mobile-open");
  });

  $('.certificate').slick({
    dots: true,
    arrows: false,
    infinite: false,
    slidesToShow: 4,
    autoplay: false,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });


  function animateCounters() {
    $('.count').each(function () {
      var $this = $(this);
      var target = parseInt($this.attr('data-target'));
      $({ countNum: 0 }).animate({ countNum: target }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          $this.text(Math.floor(this.countNum));
        },
        complete: function () {
          $this.text(target);
        }
      });
    });
  }

  let countersAnimated = false;
  $(window).on('scroll', function () {
    var offsetTop = $('.count').first().offset()?.top - window.innerHeight + 100;
    if (!countersAnimated && $(window).scrollTop() > offsetTop) {
      animateCounters();
      countersAnimated = true;
    }
  });  


  function calculateImpact(retex, qty) {
    const waterPerShirt = 2673; // baseline water use in liters
    const co2PerShirt = 3.6;    // baseline CO2 in kg

    const waterSavedPercent = Math.round(retex * 0.96);
    const co2ReducedPercent = Math.round(retex * 0.7);

    const waterSavedLiters = Math.round(waterPerShirt * (waterSavedPercent / 100) * qty);
    const co2ReducedKg = (co2PerShirt * (co2ReducedPercent / 100) * qty).toFixed(1);

    const showers = Math.round(waterSavedLiters / 65);
    const km = Math.round(co2ReducedKg / 0.128);

    return {
      waterPercent: waterSavedPercent,
      co2Percent: co2ReducedPercent,
      waterLiters: waterSavedLiters,
      co2Kg: co2ReducedKg,
      showers,
      km
    };
  }

  function updateSliderColor(value) {
    const percent = value;
    const green = "#345c3e";
    const gray = "#ccc";
    $('#retexSlider').css('background', `linear-gradient(to right, ${green} ${percent}%, ${gray} ${percent}%)`);
  }

  function updateDisplay() {
    const retex = parseInt($('#retexSlider').val());
    const qty = parseInt($('#qty').text());
    const conv = 100 - retex;

    $('#retexValue').text(retex + '%');
    $('#convValue').text(conv + '%');

    updateSliderColor(retex); // dynamically update color

    const impact = calculateImpact(retex, qty);
    $('#waterPercent').text(impact.waterPercent + '%');
    $('#waterLiters').text(impact.waterLiters + ' liters');
    $('#co2Percent').text(impact.co2Percent + '%');
    $('#co2Kg').text(impact.co2Kg + ' kg');
    $('#showers').text(impact.showers);
    $('#km').text(impact.km);
  }

  // Event bindings
  $('#retexSlider').on('input', updateDisplay);

  $('#increase').click(function () {
    let qty = parseInt($('#qty').text());
    $('#qty').text(++qty);
    updateDisplay();
  });

  $('#decrease').click(function () {
    let qty = parseInt($('#qty').text());
    if (qty > 1) {
      $('#qty').text(--qty);
      updateDisplay();
    }
  });

  // Initial load
  updateDisplay();
});
