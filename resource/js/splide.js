document.addEventListener("DOMContentLoaded", function () {
  var projectSplide = new Splide("#js-splide-projects", {
    perPage: 3,
    perMove: 1,
    focus: "center",
    arrows: false,
    autoplay: "true",
    interval: 10000,
    cover: true,
    type: "loop",
  }).mount();

  var aboutSplide = new Splide("#js-splide-about", {
    perPage: 1,
    perMove: 1,
    // arrows: true,
    cover: true,
    type: "loop",
    pagination: false,
    autoplay: "true",
    interval: 10000,
  }).mount();

  // Function to update perPage based on body class
  function updateSplidePerPage() {
    if (document.body.classList.contains("miniLandscape")) {
      // Change perPage value for tablet view
      projectSplide.options = { perPage: 2 };
      aboutSplide.options = { perPage: 1 }; // Keeping the same for about slider
    } else if (document.body.classList.contains("tablet")) {
      // Change perPage value for tablet view
      projectSplide.options = { perPage: 1.5 };
      aboutSplide.options = { perPage: 1 }; // Keeping the same for about slider
    } else if (document.body.classList.contains("mobile")) {
      // Change perPage value for mobile view
      projectSplide.options = { perPage: 1 };
      aboutSplide.options = { perPage: 1 };
    } else {
      // Default perPage value for desktop view
      projectSplide.options = { perPage: 3 };
      aboutSplide.options = { perPage: 1 };
    }
  }
  // Observe class changes on the body
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "class") {
        updateSplidePerPage();
      }
    });
  });

  // Start observing the body for class changes
  observer.observe(document.body, { attributes: true });

  // Initial check on page load
  updateSplidePerPage();
});
