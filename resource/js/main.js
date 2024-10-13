/**
 * 1. Layout Adjustments based on Screen Ratio
 * Adjusts the website layout based on the screen ratio and adds appropriate classes for tablet or mobile view.
 */
function adjustLayout() {
  const body = document.body;
  const socials = document.getElementById("socials");
  const scrolls = document.getElementById("scrolls");
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / height;

  const landscapeRatio = 16 / 9; // landscape ratio
  const miniLandscapeRatio = 4 / 3; // mini landscape ratio
  const tabletRatio = 4 / 4; // tablet ratio
  const mobileRatio = 3 / 5; // mobile ratio

  body.classList.remove("miniLandscape", "tablet", "mobile");

  body.style.height = `${height}px`;

  if (ratio >= landscapeRatio + 0.4) {
    const newWidth = height * landscapeRatio;
    body.style.width = `${newWidth}px`;

    document.documentElement.style.fontSize = "clamp(12px, 1.8vw, 2.3vh)";
  } else if (ratio < miniLandscapeRatio && ratio >= tabletRatio) {
    body.style.width = `${width}px`;
    document.documentElement.style.fontSize = "clamp(12px, 1.8vw, 2.3vh)";

    body.classList.add("miniLandscape");
  } else if (ratio < tabletRatio && ratio >= mobileRatio) {
    body.style.width = `${width}px`;
    document.documentElement.style.fontSize = "clamp(10px, 2.1vw, 1.5vh)";

    body.classList.add("tablet");
  } else if (ratio < mobileRatio) {
    body.style.width = `${width}px`;
    body.style.height = `${height + 1}px`;
    document.documentElement.style.fontSize = "clamp(6px, 2.8vw, 1.4vh)";

    body.classList.add("mobile");
  } else {
    body.style.width = `${width}px`;
    body.style.height = `${height + 1}px`;
    document.documentElement.style.fontSize = "clamp(12px, 1.8vw, 2.3vh)";
  }
}

// Call layout adjustment on window resize and orientation change
window.addEventListener("resize", adjustLayout);
window.addEventListener("orientationchange", adjustLayout);
adjustLayout(); // Initial call to adjust layout on page load

window.addEventListener("load", function () {
  adjustLayout(); // Initial call to adjust layout
});

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * 2. Check if Touch Device
 * Determines whether the device supports touch and adjusts UI interactions accordingly.
 */
if (isTouchDevice()) {
  // Disable hover effects or adjust animations for touch devices
  document.body.classList.add("touch-device");
} else {
  document.body.classList.remove("touch-device");
  console.log("non touch devices-----------------");
}

/**
 * 3. Mobile Menu Control
 * Handles the toggling of the mobile menu and closes the menu when clicking outside.
 */

// Toggle mobile menu
function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
  const hamburger = document.getElementById("hamburger");
  hamburger.classList.toggle("close");
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburger = document.getElementById("hamburger");
  const hamburgerContainer = document.querySelector(".navbar__hamburger");

  if (
    !mobileMenu.contains(event.target) &&
    !hamburgerContainer.contains(event.target)
  ) {
    if (mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      hamburger.classList.toggle("close");
    }
  }
});

/**
 * 4. Scroll Section Visibility Control
 * Handles the visibility of scroll indicators (up/down arrows) based on the section in view.
 */

const socialLinks = document.getElementById("socials");
const scrolls = document.getElementById("scrolls");
const scrollUp = document.getElementById("scroll--up");
const scrollDown = document.getElementById("scroll--down");
const mainHeader = document.getElementById("home");
const aboutSection = document.getElementById("about");
const projectSection = document.getElementById("projects");
const contactSection = document.getElementById("contact");
const footer = document.getElementById("footer");
const snapScrollElement = document.querySelector(".snap-scroll");

let lastScrollTop = 0; // Store the last scroll position to detect scroll direction

// Check if an element is in view based on scroll direction
function isInView(element, direction) {
  const rect = element.getBoundingClientRect();
  var top = rect.top + 1;
  var bottom = rect.bottom - 1;

  if (direction === "down") {
    return top > 0 && top <= window.innerHeight;
  } else if (direction === "up") {
    return bottom > 0 && bottom <= window.innerHeight;
  }
  return false;
}

// Toggle scroll visibility for the arrows
function toggleScrollVisibility(element, visibility) {
  if (visibility) {
    element.classList.add("visible");
  } else {
    element.classList.remove("visible");
  }
}

// Detect scroll behavior and adjust the visibility of the up/down scroll arrows
snapScrollElement.addEventListener("scroll", () => {
  let scrollTop = snapScrollElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scrolling Down
    if (isInView(aboutSection, "down") || isInView(projectSection, "down")) {
      toggleScrollVisibility(scrollUp, true);
      toggleScrollVisibility(scrollDown, true);
    } else if (isInView(contactSection, "down")) {
      toggleScrollVisibility(scrollUp, true);
      toggleScrollVisibility(scrollDown, true);
    } else if (isInView(footer, "down")) {
      toggleScrollVisibility(scrollUp, true);
      toggleScrollVisibility(scrollDown, false); // Hide down arrow at the end
      socialLinks.classList.add("hide");
      scrolls.classList.add("hide");
    }
  } else {
    // Scrolling Up
    if (isInView(contactSection, "up")) {
      toggleScrollVisibility(scrollUp, true);
      toggleScrollVisibility(scrollDown, true);
      socialLinks.classList.remove("hide");
      scrolls.classList.remove("hide");
    } else if (isInView(projectSection, "up") || isInView(aboutSection, "up")) {
      toggleScrollVisibility(scrollUp, true);
      toggleScrollVisibility(scrollDown, true);
      socialLinks.classList.remove("hide");
      scrolls.classList.remove("hide");
    } else if (isInView(mainHeader, "up")) {
      toggleScrollVisibility(scrollUp, false); // Hide up arrow at the top
      toggleScrollVisibility(scrollDown, true);
      socialLinks.classList.remove("hide");
      scrolls.classList.remove("hide");
    }
  }
  lastScrollTop = scrollTop;
});

/**
 * 5. Section Scroll Control
 * Handles the scrolling between sections when clicking the up/down arrows.
 */

const sections = [
  mainHeader,
  aboutSection,
  projectSection,
  contactSection,
  footer,
];

// Scroll smoothly to a specific section
function scrollToSection(section) {
  section.scrollIntoView({ behavior: "smooth" });
}

// Get the index of the currently visible section
function getCurrentSectionIndex() {
  const scrollPosition = snapScrollElement.scrollTop + window.innerHeight / 2;

  for (let i = 0; i < sections.length; i++) {
    const sectionTop = sections[i].offsetTop;
    const sectionBottom = sectionTop + sections[i].offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
      return i;
    }
  }
  return -1;
}

// Scroll to the next or previous section when clicking the down or up arrow
scrollDown.addEventListener("click", () => {
  const currentIndex = getCurrentSectionIndex();
  if (currentIndex < sections.length - 1) {
    scrollToSection(sections[currentIndex + 1]);
  }
});

scrollUp.addEventListener("click", () => {
  const currentIndex = getCurrentSectionIndex();
  if (currentIndex > 0) {
    scrollToSection(sections[currentIndex - 1]);
  }
});

/**
 * 6. Skills Section
 * Handles displaying information for each skill when its icon is clicked.
 */

// Get references to the skills container and skill description element
var skillsContainer = document.querySelector(".skills");
var skills = skillsContainer.children;
var skillDescription = document.querySelector(".about-me__skills--description");

// Convert skills NodeList into an array for easier manipulation
const skillsArray = Array.from(skills);

// Add click event listeners to each skill icon
skillsArray.forEach((img) => {
  img.addEventListener("click", function () {
    // Remove 'active' class from all skill icons
    skillsArray.forEach((el) => el.classList.remove("active"));

    // Add 'active' class to the clicked icon and update the skill description
    this.classList.add("active");
    skillDescription.innerHTML = this.dataset.info;
  });
});
