document.addEventListener("DOMContentLoaded", function () {
  new Splide("#js-splide", {
    perPage: 3,
    perMove: 1,
    arrows: true,
    focus: "center",
    pagination: false,
    cover: true,
    type: "loop",
    breakpoints: {
      800: {
        perPage: 2,
        // focus: 0,
      },
      600: {
        perPage: 1,
      },
    },
  }).mount();
});
