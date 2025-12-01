import { loadCoderhomePost, loadDevToPost } from "/scripts/home/api.js";

const coderHome = document.querySelector(".coderhome");
const devTo = document.querySelector(".devto");


coderHome.addEventListener("click", () => {
  loadCoderhomePost(true);
});

devTo.addEventListener("click", () => {
  loadDevToPost(true);
});
