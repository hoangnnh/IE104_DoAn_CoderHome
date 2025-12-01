import {
  loadCoderhomePost,
  loadDevToPost,
  loadAuthor,
  addFollow,
  deleteFollow
} from "/scripts/home/api.js";

import {
  handleLikeClick,
  handleCommentClick,
  handleBookmarkClick,
  handleRemoveClick
} from "/scripts/utils/postHandler.js";

let currentTab = "coderhome";
let isLoading = false;
let hasMore = true;

const scrollBtn = document.getElementById("scrollTopBtn");

// Infinite scroll handler
function handleScroll() {
  // Get the scroll position
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Calculate if user is near bottom (within 200px)
  const isNearBottom = scrollTop + windowHeight >= documentHeight - 200;

  if (isNearBottom && !isLoading && hasMore) {
    if (currentTab === "coderhome") {
      loadCoderhomePost(false);
    } else if (currentTab === "devto") {
      loadDevToPost(false);
    }
  }
}

// Following btn
document.addEventListener("click", async function (e) {
  if (e.target.closest(".follow__btn")) {
    const btn = e.target.closest(".follow__btn");
    const authorId = btn.dataset.value;

    // Toggle UI
    if (btn.classList.contains("active")) {
      await deleteFollow(authorId);
      btn.classList.remove("active");
      btn.textContent = "Follow";
    } else {
      await addFollow(authorId);
      btn.classList.add("active");
      btn.textContent = "Following";
    }
  }
});

window.addEventListener("scroll", handleScroll);

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Redirect "See more suggestions" to /following
document.querySelectorAll("aside a").forEach((link) => {
  if (link.textContent.trim() === "See more suggestions") {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "/following?tab=author&authorTab=more";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const postContainer = document.querySelector(".post");
  // Setup event delegation
  handleLikeClick(postContainer);
  handleBookmarkClick(postContainer);
  handleCommentClick(postContainer);
  handleRemoveClick(postContainer);
  loadCoderhomePost(true);
  loadAuthor();
});
