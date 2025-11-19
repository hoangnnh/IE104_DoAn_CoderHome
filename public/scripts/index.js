import { getRandomLikeCount, handleLikeClick, handleBookmarkClick } from "/scripts/helpers.js";

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
    const postsHTML = posts
      .map((p, index) => {
        const isLastInBatch = index === posts.length - 1;
        const showDivider = !isLastInBatch || hasMore;

        return `<article class="post__card">
          <div class="post__author">
            <img src="${p.author.profilePicture}" alt="author" class="post__author-img"/>
            <a href="/profile/${p.author._id}" class="post__author-name">${p.author?.username || "Unknown"}</a>
          </div>
          <div class="post__left">
            <div class="post__left-text">
              <div class="post__content">
                <a href="/post/${p._id}" class="post__content-title">${p.title}</a>
                <p class="post__content-overview">${p.description}</p>
              </div>
              <div class="post__interact">
                <div class="post__interact-meta">
                  <span class="created_date">${new Date(p.createdAt).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        })}</span>
                  <div class="like-count" style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/heart-outline-icon.svg" class="react-icon-meta heart"/>
                    <span>${getRandomLikeCount()}</span>
                  </div>
                  <span style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/comment-icon.svg" class="react-icon-meta" style="display: inline;"/> 170
                  </span>
                </div>
                <div class="post__interact-action">
                  <button class="icon-btn remove-post"><img src="/images/icons/remove-icon.svg" class="react-icon"/></button>
                  <button class="icon-btn bookmark-btn"><img src="/images/icons/bookmark-outline-icon.svg" class="react-icon"/></button>
                  <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
                </div>
              </div>
            </div>
            <img src="${p.thumbnailUrl}" class="post__img"/>
          </div>
          ${showDivider ? '<hr class="divider">' : ""}
        </article>`;
      })
      .join("");

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
    const postsHTML = posts
      .map((p, index) => {
        const isLastInBatch = index === posts.length - 1;
        const showDivider = !isLastInBatch || hasMore;

        return `<article class="post__card">
          <div class="post__author">
            <img src="${p.user.profile_image}" alt="author" class="post__author-img"/>
            <a href="https://dev.to/${p.user.username}" target="_blank" class="post__author-name">
              ${p.user.name || p.user.username}
            </a>
          </div>
          <div class="post__left">
            <div class="post__left-text">
              <div class="post__content">
                <a href="${p.url}" target="_blank" class="post__content-title">${p.title}</a>
                <p class="post__content-overview">${p.description || ""}</p>
              </div>
              <div class="post__interact">
                <div class="post__interact-meta">
                  <span class="created_date">${new Date(p.published_at).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        })}</span>
                  <div class="like-count" style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/heart-outline-icon.svg" class="react-icon-meta heart"/> <span>${p.public_reactions_count}</span>
                  </div>
                  <span style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/comment-icon.svg" class="react-icon-meta"/> ${p.comments_count}
                  </span>
                </div>
                <div class="post__interact-action">
                  <button class="icon-btn remove-post"><img src="/images/icons/remove-icon.svg" class="react-icon"/></button>
                  <button class="icon-btn bookmark-btn"><img src="/images/icons/bookmark-outline-icon.svg" class="react-icon"/></button>
                  <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
                </div>
              </div>
            </div>
            <img src="${p.cover_image || "/images/samples/default-thumbnail.png"}" class="post__img"/>
          </div>
          ${showDivider ? '<hr class="divider">' : ""}
        </article>`;
      })
      .join("");

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
})

document.querySelectorAll(".follow__btn").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("followed");

    item.textContent = item.classList.contains("followed") ? "Following" : "Follow";
  })
})

coderHome.addEventListener("click", () => {
  loadCoderhomePost(true)
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
    behavior: "smooth"
  });
});

document.addEventListener("DOMContentLoaded", () => {
  loadCoderhomePost(true)
})