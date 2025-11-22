import {
  getRandomLikeCount,
  handleLikeClick,
  handleBookmarkClick,
} from "/scripts/helpers.js";
import { renderPostCard } from "/scripts/components/post-card.js";

const coderHome = document.querySelector(".coderhome");
const devTo = document.querySelector(".devto");
const scrollBtn = document.getElementById("scrollTopBtn");

let currentPage = 1;
let currentTab = "coderhome";
let isLoading = false;
let hasMore = true;
const posts_per_page = 10;

// Function to load Coderhome's posts
async function loadCoderhomePost(isInitial = true) {
  if (isInitial) {
    currentPage = 1;
    hasMore = true;
    coderHome.style.cssText = `
      border-bottom: 2px solid #f2f2f2;
      font-weight: bold;
    `;
    devTo.style.cssText = `
      border-bottom: 0;
      font-weight: normal;
    `;
    currentTab = "coderhome";
  }

  if (isLoading || !hasMore) return;
  isLoading = true;

  try {
    // get all posts from DB
    const res = await fetch("/posts/");
    const allPosts = await res.json();

    // Calculate each posts of 1 load
    const startIndex = (currentPage - 1) * posts_per_page;
    const endIndex = startIndex + posts_per_page;
    const posts = allPosts.slice(startIndex, endIndex);

    // Check if there are more posts
    hasMore = endIndex < allPosts.length;
    const container = document.querySelector(".post");

    // If this is the first load, clear container
    if (isInitial) {
      container.innerHTML = "";
    }

    // Append new posts
    const postsHTML = posts.map((p) => renderPostCard(p)).join("");

    container.insertAdjacentHTML("beforeend", postsHTML);

    handleLikeClick();
    handleBookmarkClick();

    currentPage++;
  } catch (err) {
    console.error("Error loading Coderhome posts:", err);
  } finally {
    isLoading = false;
  }
}
// Function to load posts from Dev.to
async function loadDevToPost(isInitial = true) {
  if (isInitial) {
    currentPage = 1;
    hasMore = true;
    devTo.style.cssText = `
      border-bottom: 2px solid #f2f2f2;
      font-weight: bold;
    `;
    coderHome.style.cssText = `
      border-bottom: 0;
      font-weight: normal;
    `;
    currentTab = "devto";
  }

  if (isLoading || !hasMore) return;
  isLoading = true;

  try {
    // Fetch posts with pagination from Dev.to API
    const res = await fetch(
      `https://dev.to/api/articles?page=${currentPage}&per_page=${posts_per_page}`
    );
    const posts = await res.json();

    // Check if there are more posts
    hasMore = posts.length === posts_per_page;

    const container = document.querySelector(".post");

    // If initial load, clear container
    if (isInitial) {
      container.innerHTML = "";
    }

    // Append new posts
    const postsHTML = posts.map((p) => renderPostCard(p, 0, 1)).join("");

    container.insertAdjacentHTML("beforeend", postsHTML);

    handleLikeClick();
    handleBookmarkClick();

    currentPage++;
  } catch (err) {
    console.error("Error fetching Dev.to posts:", err);
  } finally {
    isLoading = false;
  }
}
async function loadAuhor() {
  const res = await fetch(`/profiles/`);
  const authors = await res.json();

  const res2 = await fetch(`/current/`);
  const currentUser = await res2.json();
  const container = document.querySelector(".rcm__follow-list");

  const followingIds = currentUser.followingAuthors.map(
    (author) => author._id || author
  );

  const filteredAuthors = authors.filter((author) => {
    return author._id !== currentUser && !followingIds.includes(author._id);
  });

  function getRandom3(arr) {
    const result = [];
    const len = arr.length;

    if (len < 3) {
      throw new Error("Mảng phải có ít nhất 3 phần tử");
    }

    const taken = new Set();

    while (result.length < 3) {
      const i = Math.floor(Math.random() * len);

      if (!taken.has(i)) {
        taken.add(i);
        result.push(arr[i]);
      }
    }

    return result;
  }
  const author3 = getRandom3(filteredAuthors);

  container.innerHTML = author3
    .map(
      (author) => `
        <li class="rcm__follow-list-item">
          <img src="${author.profilePicture}" alt="Recommended blogger's avatar" class="avatar">
          <div class="content">
            <a href="" class="name">${author.username}</a>
            <p class="bio">${author.bio}</p>
          </div>
          <button class="follow__btn" data-value="${author._id}">
            Follow
          </button>
        </li>
  `
    )
    .join("");
}
async function addFollow(id) {
  await fetch(`/profiles/follow/add/${id}`, {
    method: "POST",
  });
  console.log(id);
}
async function deleteFollow(id) {
  await fetch(`/profiles/follow/delete/${id}`, {
    method: "DELETE",
  });
  console.log(id);
}
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

// Handle remove post (UI only)
document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-post");
  if (!removeBtn) return;

  const postCard = removeBtn.closest(".post__card");
  if (postCard) {
    postCard.classList.add("hidden");

    setTimeout(() => {
      postCard.style.display = "none";
    }, 400); // match CSS transition time
  }
});

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
// document.querySelectorAll(".follow__btn").forEach((item) => {
//   item.addEventListener("click", () => {
//     item.classList.toggle("followed");

//     item.textContent = item.classList.contains("followed")
//       ? "Following"
//       : "Follow";
//   });
// });

coderHome.addEventListener("click", () => {
  loadCoderhomePost(true);
});

devTo.addEventListener("click", () => {
  loadDevToPost(true);
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

document.addEventListener("DOMContentLoaded", () => {
  loadCoderhomePost(true);
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

//Call function
loadAuhor();
