(function () {
  // https://dashboard.emailjs.com/admin/account
  emailjs.init({
    publicKey: "SsVAIyHYfSSn9mouk",
  });
})();

window.onload = function () {
  const submitButton = document.getElementById("submit_button");
  const buttonText = document.querySelector(".btn-text");
  const contactForm = document.getElementById("contact-form");

  // add sending indicator
  submitButton.classList.remove("success", "failed");
  buttonText.textContent = "Send Message";

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitButton.classList.add("loading");
    buttonText.textContent = "Sending...";
    // these IDs from the previous steps
    emailjs.sendForm("service_9bggxs1", "contact_form", this).then(
      () => {
        console.log("SUCCESS!");
        submitButton.classList.remove("loading");
        submitButton.classList.add("success");
        buttonText.textContent = "Submitted";
        contactForm.reset();
      },
      (error) => {
        console.log("FAILED...", error);
        submitButton.classList.remove("loading");
        submitButton.classList.add("failed");
        buttonText.textContent = "Failed";
        contactForm.reset();
      }
    );
  });
};
