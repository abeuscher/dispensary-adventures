var Swiper = require("swiper/bundle").default; // Make sure you are correctly importing the default Swiper class

function ReviewCarousel(els) {
  console.log("Review Carousel", els);
  if (els[0].querySelectorAll(".swiper-slide").length > 1) {
    var rc = new Swiper(els[0], {
      loop: true,
      pagination: {
        clickable: true,
      },
    });
    rc.on("slideChange", function () {
      var zooms = document.querySelectorAll(".lens");
      for (var i = 0; i < zooms.length; i++) {
        zooms[i].classList.remove("active");
      }
    });
  }
}

module.exports = ReviewCarousel;
