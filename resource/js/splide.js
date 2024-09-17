document.addEventListener("DOMContentLoaded", function () {
  new Splide("#js-splide-projects", {
    perPage: 3,
    perMove: 1,
    focus: "center",
    arrows: false,
    autoplay: "true",
    interval: 4000,
    cover: true,
    type: "loop",
    breakpoints: {
      900: {
        perPage: 2,
        // focus: 0,
      },
      600: {
        perPage: 1,
      },
    },
  }).mount();

  new Splide("#js-splide-about", {
    perPage: 1,
    perMove: 1,
    // arrows: true,
    cover: true,
    type: "loop",
    pagination: false,
    autoplay: "true",
    interval: 5000,
  }).mount();
});
