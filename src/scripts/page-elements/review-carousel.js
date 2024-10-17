var Swiper = require("swiper/bundle").default;

function ReviewCarousel(els) {
  console.log(els[0].querySelectorAll(".swiper-pagination")[0]);
  if (els[0].querySelectorAll(".swiper-slide").length > 1) {
    var rc = new Swiper(els[0], {
      loop: true,
      pagination: {
        el: els[0].querySelectorAll(".swiper-pagination")[0],
        clickable: true,
      },
      navigation: {
        nextEl: els[0].querySelectorAll(".swiper-button-next")[0],
        prevEl: els[0].querySelectorAll(".swiper-button-prev")[0],
      },
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
      },
    });

    // Force update after initialization
    rc.pagination.render();
    rc.pagination.update();

    rc.on("slideChange", function () {
      var zooms = document.querySelectorAll(".lens");
      for (var i = 0; i < zooms.length; i++) {
        zooms[i].classList.remove("active");
      }
    });
  }
}

module.exports = ReviewCarousel;
