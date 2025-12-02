import { loadPosts, loadUsers, tabEvent } from "/scripts/search/api.js";

// Invoke function when load page
document.addEventListener("DOMContentLoaded", async () => {
  await loadPosts();
  tabEvent();
})