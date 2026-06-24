const tags = document.querySelectorAll("[data-copyright]");
const currYear = new Date().getFullYear();

tags.forEach((tag) => {
  tag.innerText = "© " + currYear;
});
