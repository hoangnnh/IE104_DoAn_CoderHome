import { getRandomLikeCount, handleLikeClick, handleBookmarkClick } from "/scripts/helpers.js";

// --- Hàm load bài viết của các tác giả mà người dùng đang follow ---
async function loadFollowedPost() {
  const res = await fetch(`/posts/`);
  const res2 = await fetch(`/current/`);

  const user = await res2.json();
  const allposts = await res.json();
  const followingIds = user.followingAuthors.map((id) => id.toString()); // Lấy danh sách ID của tác giả đang follow
  const container = document.querySelector(".main__content");

  const posts = allposts
    .filter((post) => followingIds.includes(post.author._id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp bài mới nhất lên trên

  if (posts && posts.length > 0) {
    container.innerHTML = posts
      .map(
        (post) => `
        <hr class="divider">
        <article class="post__card">
          <div class="post__author">
            <img src="${post.author.profilePicture}" alt="author" class="post__author-img"/>
            <a href="/profile/${post.author._id}" class="post__author-name">${post.author?.username || "Unknown"}</a>
          </div>
          <div class="post__left">
            <div class="post__left-text">
              <div class="post__content">
                <a href="/post/${post._id}" class="post__content-title">${post.title}</a>
                <p class="post__content-overview">${post.description}</p>
              </div>
              <div class="post__interact">
                <div class="post__interact-meta">
                  <span class="created_date">${new Date(post.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</span>
                  <div class="like-count" style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/heart-outline-icon.svg" class="react-icon-meta heart"/>
                    <span>${getRandomLikeCount()}</span>
                  </div>
                  <span style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/comment-icon.svg" class="react-icon-meta" style="display: inline;"/> 170
                  </span>
                </div>
                <div class="post__interact-action">
                  <button class="icon-btn bookmark-btn"><img src="/images/icons/bookmark-outline-icon.svg" class="react-icon"/></button>
                  <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
                </div>
              </div>
            </div>
            <img src="${post.thumbnailUrl}" class="post__img"/>
          </div>
        </article>
      `
      )
      .join("");  

    handleLikeClick(); // Gắn sự kiện like
    handleBookmarkClick(); // Gắn sự kiện bookmark
  } else {
    container.innerHTML = `
      <hr class="divider"></hr>
      <p class="error__not-found">You haven't Follow any one yet!!</p>
    `;
  }
}

// --- Hàm load bài viết theo topic ---
async function loadPostByTopic(topic) {
  const res = await fetch(`/posts/`);
  const res2 = await fetch(`/current/`);
  const allposts = await res.json();
  const user = await res2.json();
  const followingIds = user.followingAuthors.map((id) => id.toString());

  const filteredTopicPosts = filterPostsByTag(allposts, topic);
  const container = document.querySelector(".main__content");

  const filteredPosts = filteredTopicPosts
    .filter((post) => followingIds.includes(post.author._id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (filteredPosts && filteredPosts.length > 0) {
    container.innerHTML = filteredPosts
      .map(
        (post) => `
        <hr class="divider">
        <article class="post__card">
          <div class="post__author">
            <img src="${post.author.profilePicture}" alt="author" class="post__author-img"/>
            <a href="/profile/${post.author._id}" class="post__author-name">${post.author?.username || "Unknown"}</a>
          </div>
          <div class="post__left">
            <div class="post__left-text">
              <div class="post__content">
                <a href="/post/${post._id}" class="post__content-title">${post.title}</a>
                <p class="post__content-overview">${post.description}</p>
              </div>
              <div class="post__interact">
                <div class="post__interact-meta">
                  <span class="created_date">${new Date(post.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</span>
                  <div class="like-count" style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/heart-outline-icon.svg" class="react-icon-meta heart"/>
                    <span>${getRandomLikeCount()}</span>
                  </div>
                  <span style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/comment-icon.svg" class="react-icon-meta" style="display: inline;"/> 170
                  </span>
                </div>
                <div class="post__interact-action">
                  <button class="icon-btn bookmark-btn"><img src="/images/icons/bookmark-outline-icon.svg" class="react-icon"/></button>
                  <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
                </div>
              </div>
            </div>
            <img src="/images/samples/default-thumbnail.png" class="post__img"/>
          </div>
        </article>
      `
      )
      .join("");

    handleLikeClick();
    handleBookmarkClick();
  } else {
    container.innerHTML = `
      <hr class="divider"></hr>
      <p class="error__not-found">Can't find post of this Topic! It's maybe you haven't Follow any one yet Or no post of this topic!!</p>
    `;
  }
}

// --- Các hàm & sự kiện Responsive, Topic, Dropdown ---
// Các const DOM
const btnLeft = document.getElementById("scrollLeft");
const btnRight = document.getElementById("scrollRight");
const dropdownHeader = document.querySelector(".dropdown__header");
const dropdownHeaderItem = document.querySelector(".dropdown__header-item");
const arrow = document.querySelector(".arrow");
const dropdown = document.querySelector(".dropdown__container");
const dropdownItems = document.querySelectorAll(".dropdown__item");
const tabs = document.querySelectorAll(".nav__items");
const topicContainer = document.querySelector(".topic__nav");
const topicContent = document.querySelector(".topic__content");
const topics = document.querySelectorAll(".topic");
const fadeLeft = document.querySelector(".fade-left");
const fadeRight = document.querySelector(".fade-right");
const scrollBtn = document.querySelector(".scroll-top");

// --- Hàm kiểm tra và hiện/ẩn mũi tên khi scroll topic ---
function updateArrowsAndFade() {
  const scrollLeft = topicContent.scrollLeft;
  const maxScroll = topicContent.scrollWidth - topicContent.clientWidth;

  btnLeft.style.display = scrollLeft > 5 ? "block" : "none";
  fadeLeft.style.display = scrollLeft > 5 ? "block" : "none";

  btnRight.style.display = scrollLeft < maxScroll - 5 ? "block" : "none";
  fadeRight.style.display = scrollLeft < maxScroll - 5 ? "block" : "none";
}

// --- Hàm lọc bài viết theo tag ---
function filterPostsByTag(postsArray, targetTag) {
  const normalizedTag = targetTag.toLowerCase();
  return postsArray.filter((post) => post.tags && Array.isArray(post.tags) && post.tags.some((tag) => tag.toLowerCase() === normalizedTag));
}

// --- Scroll topic buttons ---
btnLeft.addEventListener("click", () => topicContent.scrollBy({ left: -200, behavior: "smooth" }));
btnRight.addEventListener("click", () => topicContent.scrollBy({ left: 200, behavior: "smooth" }));

topicContent.addEventListener("scroll", updateArrowsAndFade);
window.addEventListener("resize", updateArrowsAndFade);

// --- Tab navigation ---
tabs.forEach((tab) => {
  tab.addEventListener("click", async (e) => {
    e.preventDefault();
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    if (tab.dataset.tab === "all") {
      loadFollowedPost();
      topicContainer.classList.remove("active");
    } else if (tab.dataset.tab === "topic") {
      const activeTopic = document.querySelector(".topic.active");
      loadPostByTopic(activeTopic.dataset.value);
      topicContainer.classList.add("active");
      updateArrowsAndFade();
    }
  });
});

// --- Dropdown selection ---
dropdownHeader.addEventListener("click", (e) => {
  e.preventDefault();
  dropdown.classList.toggle("active");
  arrow.classList.toggle("active");
});
dropdownItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownHeaderItem.textContent = item.getAttribute("data-value");
    dropdown.classList.remove("active");
  });
});

// --- Chọn topic ---
topics.forEach((topic) => {
  topic.addEventListener("click", async (e) => {
    e.preventDefault();
    topics.forEach((t) => t.classList.remove("active"));
    topic.classList.add("active");
    loadPostByTopic(topic.dataset.value);
    updateArrowsAndFade();
  });
});

// --- Scroll top ---
window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 200 ? "block" : "none";
});
scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// --- Call function ban đầu ---
loadFollowedPost();
updateArrowsAndFade();
