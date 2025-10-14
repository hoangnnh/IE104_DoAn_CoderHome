const hamburger = document.querySelector(".button-menu");
const menu = document.querySelector(".menu");
//When clicking Hamburger Button
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  menu.classList.toggle("active");
});

// const hamburger = document.getElementsByClassName("button-menu")[0];
// const menu = document.getElementsByClassName("menu")[0];

// hamburger.addEventListener("click", () => {
//   hamburger.classList.toggle("active");
//   menu.classList.toggle("active");
// });
