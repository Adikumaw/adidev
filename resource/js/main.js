var skillsContainer = document.querySelector(".skills");
var skills = skillsContainer.children;
console.log(skills);
var skillDescription = document.querySelector(".about-me__skills--description");

const skillsArray = Array.from(skills);

skillsArray.forEach((img) => {
  img.addEventListener("click", function () {
    // Remove 'active' class from all images
    skillsArray.forEach((el) => el.classList.remove("active"));

    // Add 'active' class to the clicked image
    this.classList.add("active");
    skillDescription.innerHTML = this.dataset.info;
  });
});

// Some weird issues on mobile & safari - damn .. any ideas?

document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", (e) => {
    button.classList.add("processing");
    e.preventDefault();
  });
});
