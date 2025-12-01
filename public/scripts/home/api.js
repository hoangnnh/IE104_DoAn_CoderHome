import { renderPostCard } from "/scripts/components/post-card.js";

const coderHome = document.querySelector(".coderhome");
const devTo = document.querySelector(".devto");

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
    // get 10 posts from DB each scroll
    const res = await fetch(
      `/posts?currentPage=${currentPage}&posts_per_page=${posts_per_page}`
    );
    const data = await res.json();
    const posts = data.posts;

    // Check if there are more posts
    hasMore = data.hasMore;
    const container = document.querySelector(".post");

    // If this is the first load, clear container
    if (isInitial) {
      container.innerHTML = "";
    }

    // Append new posts
    const postsHTML = posts.map((p) => renderPostCard(p)).join("");

    container.insertAdjacentHTML("beforeend", postsHTML);

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

    currentPage++;
  } catch (err) {
    console.error("Error fetching Dev.to posts:", err);
  } finally {
    isLoading = false;
  }
}

// Load random 3 unfollowed author
async function loadAuthor() {
  const authors = await fetch(`/profiles/`)
    .then(a => a.json());

  const currentUser = await fetch(`/current/`)
    .then(c => c.json());

  const container = document.querySelector(".rcm__follow-list");

  const followingIds = currentUser.followingAuthors.map(
    (author) => author._id || author
  );

  const filteredAuthors = authors.filter((author) => {
    return author._id !== currentUser._id && !followingIds.includes(author._id);
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
            <a href="/profile/${author._id}" class="name">${author.username}</a>
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
}
async function deleteFollow(id) {
  await fetch(`/profiles/follow/delete/${id}`, {
    method: "DELETE",
  });
}

export { loadCoderhomePost, loadDevToPost, loadAuthor, addFollow, deleteFollow };