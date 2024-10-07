/**
 * 1. Layout Adjustments based on Screen Ratio
 * Adjusts the website layout based on the screen ratio and adds appropriate classes for tablet or mobile view.
 */
function adjustLayout() {
  const body = document.body;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / height;

  const landscapeRatio = 16 / 9; // Example landscape ratio
  const miniLandscapeRatio = 4 / 3; // Example mini landscape ratio
  const tabletRatio = 4 / 4; // Example tablet ratio
  const mobileRatio = 3 / 5; // Example mobile ratio

  body.classList.remove("miniLandscape", "tablet", "mobile");

  if (ratio >= landscapeRatio + 0.4) {
    console.log("Landscape ratio with wider width");
    const newWidth = height * landscapeRatio;
    body.style.width = `${newWidth}px`;

    document.documentElement.style.fontSize = "clamp(12px, 1.8vw, 2.3vh)";
  } else if (ratio < miniLandscapeRatio && ratio >= tabletRatio) {
    console.log("mini Landscape ratio");
    body.classList.add("miniLandscape");

    // set root font size
    document.documentElement.style.fontSize = "clamp(12px, 1.8vw, 2.3vh)";
  } else if (ratio < tabletRatio && ratio >= mobileRatio) {
    console.log("tablet ratio");
    body.classList.add("tablet");

    // set root font size
    document.documentElement.style.fontSize = "clamp(16px, 2.1vw, 1.5vh)";
  } else if (ratio < mobileRatio) {
    console.log("mobile ratio");
    body.classList.add("mobile");
  } else {
    console.log("Landscape ratio");
    body.style.width = "100%";
    body.style.marginLeft = "0";
    body.style.marginRight = "0";

    // set root font size
    document.documentElement.style.fontSize = "clamp(12px, 1.8vw, 2.3vh)";
  }
}

// Call layout adjustment on window resize and orientation change
window.addEventListener("resize", adjustLayout);
window.addEventListener("orientationchange", adjustLayout);
adjustLayout(); // Initial call to adjust layout on page load

// Toggle mobile menu
function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
}

/**
 * 2. Scroll Section Visibility Control
 * This section handles showing or hiding the up/down scroll indicators based on the current section in view.
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

/**
 * Function: isInView
 * Checks if an element is in view based on scroll direction.
 */
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

/**
 * Function: toggleScrollVisibility
 * Shows or hides the scroll arrow indicators.
 */
function toggleScrollVisibility(element, visibility) {
  if (visibility) {
    element.classList.add("visible");
  } else {
    element.classList.remove("visible");
  }
}

// Add scroll event listener on the snapScrollElement to detect scroll behavior
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
 * 3. Section Scroll Control
 * Handles scrolling to the next or previous section when clicking the up/down arrows.
 */

const sections = [
  mainHeader,
  aboutSection,
  projectSection,
  contactSection,
  footer,
];

/**
 * Function: scrollToSection
 * Scrolls smoothly to the given section.
 */
function scrollToSection(section) {
  section.scrollIntoView({ behavior: "smooth" });
}

/**
 * Function: getCurrentSectionIndex
 * Returns the index of the section currently in view.
 */
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

// Scroll event listeners for up/down arrow buttons
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
 * 4. Skills Section
 * This section handles the click behavior on skill icons and displays corresponding information.
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
