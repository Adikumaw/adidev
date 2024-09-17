/**
 * 1. Skills Section
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

/**
 * 2. Scroll Section Visibility Control
 * This section handles showing or hiding the up/down scroll indicators based on the current section in view.
 */

const socialLinks = document.getElementById("socials");
const scrolls = document.getElementById("scrolls");
// Get references to the scroll buttons and page sections
const scrollUp = document.getElementById("scroll--up");
const scrollDown = document.getElementById("scroll--down");
const mainHeader = document.getElementById("home");
const aboutSection = document.getElementById("about");
const projectSection = document.getElementById("projects");
const contactSection = document.getElementById("contact");
const footer = document.getElementById("footer");
const snapScrollElement = document.querySelector(".snap-scroll"); // Correct scroll event target

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
    element.classList.add("visible"); // Adds the class if visible
  } else {
    element.classList.remove("visible"); // Removes the class if not visible
  }
}

// Add scroll event listener on the snapScrollElement to detect scroll behavior
snapScrollElement.addEventListener("scroll", () => {
  let scrollTop = snapScrollElement.scrollTop; // Current scroll position

  // Detect if the user is scrolling down or up
  if (scrollTop > lastScrollTop) {
    console.log("Scrolling Down");

    if (isInView(aboutSection, "down")) {
      toggleScrollVisibility(scrollUp, true);
      toggleScrollVisibility(scrollDown, true);
    } else if (isInView(projectSection, "down")) {
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
    console.log("Scrolling Up");

    if (isInView(contactSection, "up")) {
      toggleScrollVisibility(scrollUp, true);
      toggleScrollVisibility(scrollDown, true);
      socialLinks.classList.remove("hide");
      scrolls.classList.remove("hide");
    } else if (isInView(projectSection, "up")) {
      toggleScrollVisibility(scrollUp, true);
      toggleScrollVisibility(scrollDown, true);
      socialLinks.classList.remove("hide");
      scrolls.classList.remove("hide");
    } else if (isInView(aboutSection, "up")) {
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
  lastScrollTop = scrollTop; // Update the last scroll position
});

/**
 * 3. Section Scroll Control
 * Handles scrolling to the next or previous section when clicking the up/down arrows.
 */

// Array of sections on the page
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
  return -1; // If no section is found, return -1
}

// Event listener for clicking the down arrow to scroll to the next section
scrollDown.addEventListener("click", () => {
  const currentIndex = getCurrentSectionIndex();
  if (currentIndex < sections.length - 1) {
    scrollToSection(sections[currentIndex + 1]);
  }
});

// Event listener for clicking the up arrow to scroll to the previous section
scrollUp.addEventListener("click", () => {
  const currentIndex = getCurrentSectionIndex();
  if (currentIndex > 0) {
    scrollToSection(sections[currentIndex - 1]);
  }
});
