(function () {
  // https://dashboard.emailjs.com/admin/account
  emailjs.init({
    publicKey: "SsVAIyHYfSSn9mouk",
  });
})();

window.onload = function () {
  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // these IDs from the previous steps

    emailjs
      .sendForm("service_9bggxs1", "contact_form", this)
      .then(() => {
        console.log("SUCCESS!");
        contactForm.reset();
      })
      .catch((err) => console.error(err));
  });
};
