import { getRandomLikeCount, handleLikeClick, handleBookmarkClick } from "/scripts/helpers.js";

async function loadFollowedPost() {
  const res = await fetch(`/posts/`);
  const res2 = await fetch(`/current/`);

  const user = await res2.json();
  const allposts = await res.json();
  const followingIds = user.followingAuthors.map((id) => id.toString());
  const container = document.querySelector(".main__content");

  const posts = allposts
    .filter((post) => followingIds.includes(post.author._id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  container.innerHTML = posts
    .map(
      (post) =>
        ` 
        <hr class="divider">
        <article class="post__card">
        <div class="post__author">
            <img src="${post.author.profilePicture
        }" alt="author" class="post__author-img"/>
                <a href="/profile/${post.author._id
        }" class="post__author-name">${post.author?.username || "Unknown"
        }</a>
        </div>
        <div class="post__left">
            <div class="post__left-text">
                <div class="post__content">
                    <a href="/post/${post._id}" class="post__content-title">${post.title
        }</a>
                    <p class="post__content-overview">${post.description}</p>
                </div>
                <div class="post__interact">
                    <div class="post__interact-meta">
                        <span class="created_date">${new Date(
          post.createdAt
        ).toLocaleDateString("vi-VN", {
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

  handleLikeClick();
  handleBookmarkClick();

}

async function loadPostByTopic(topic) {
  const res = await fetch(`/posts/`);
  const res2 = await fetch(`/current/`);
  const allposts = await res.json();
  const user = await res2.json();
  const followingIds = user.followingAuthors.map((id) => id.toString());

  const filteredTopicPosts = filterPostsByTag(allposts, topic);
  const container = document.querySelector(".main__content");

  const fillteredPosts = filteredTopicPosts
    .filter((post) => followingIds.includes(post.author._id))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (fillteredPosts && fillteredPosts.length > 0) {
    container.innerHTML = fillteredPosts
      .map(
        (post) => `
        <hr class="divider">
        <article class="post__card">
        <div class="post__author">
            <img src="${post.author.profilePicture
          }" alt="author" class="post__author-img"/>
                <a href="/profile/${post.author._id
          }" class="post__author-name">${post.author?.username || "Unknown"
          }</a>
        </div>
        <div class="post__left">
            <div class="post__left-text">
                <div class="post__content">
                    <a href="/post/${post._id}" class="post__content-title">${post.title
          }</a>
                    <p class="post__content-overview">${post.description}</p>
                </div>
                <div class="post__interact">
                  <div class="post__interact-meta">
                    <span class="created_date">${new Date(
            post.createdAt
          ).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          })}
                    </span>
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
    <p  class="error__not-found">Post Not Found!!</p>
    `;
  }
}

// Responsive

// Const
const btnLeft = document.getElementById("scrollLeft");
const btnRight = document.getElementById("scrollRight");
const dropdownHeader = document.querySelector(".dropdown__header");
const dropdownHeaderItem = document.querySelector(".dropdown__header-item");
const arrow = document.querySelector(".arrow");
const selection = document.querySelector(".dropdown__selection");
const dropdownItems = document.querySelectorAll(".dropdown__item");
const dropdown = document.querySelector(".dropdown__container");
const tabs = document.querySelectorAll(".nav__items");
const container = document.querySelector(".main__content");
const topicContainer = document.querySelector(".topic__nav");
const topicContent = document.querySelector(".topic__content");
const topics = document.querySelectorAll(".topic");
const fadeLeft = document.querySelector(".fade-left");
const fadeRight = document.querySelector(".fade-right");
const scrollBtn = document.querySelector(".scroll-top");
//
//Event

// Khi bấm vào mỗi tab

tabs.forEach((tab) => {
  tab.addEventListener("click", async function (e) {
    e.preventDefault();

    tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    const type = this.dataset.tab;

    if (type === "all") {
      loadFollowedPost();
      topicContainer.classList.remove("active");
    } else if (type === "topic") {
      const activeTopic = document.querySelector(".topic.active");
      loadPostByTopic(activeTopic.dataset.value);
      topicContainer.classList.add("active");
      updateArrowsAndFade();
    }
  });
});

//Dropdown
dropdownHeader.addEventListener("click", (e) => {
  e.preventDefault();
  dropdown.classList.toggle("active");
  arrow.classList.toggle("active");
});
dropdownItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const selected = item.getAttribute("data-value");
    dropdownHeaderItem.textContent = selected;
    dropdown.classList.remove("active");
  });
});

// --------Topic arrow--------
function updateArrowsAndFade() {
  const scrollLeft = topicContent.scrollLeft;
  const maxScroll = topicContent.scrollWidth - topicContent.clientWidth;

  if (scrollLeft > 5) {
    btnLeft.style.display = "block";
    fadeLeft.style.display = "block";
  } else {
    btnLeft.style.display = "none";
    fadeLeft.style.display = "none";
  }
  if (scrollLeft < maxScroll - 5) {
    btnRight.style.display = "block";
    fadeRight.style.display = "block";
  } else {
    btnRight.style.display = "none";
    fadeRight.style.display = "none";
  }
}

function filterPostsByTag(postsArray, targetTag) {
  const normalizedTag = targetTag.toLowerCase();

  return postsArray.filter((post) => {
    // 1. Kiểm tra xem post có thuộc tính 'tags' là một mảng không
    if (post.tags && Array.isArray(post.tags)) {
      // 2. Kiểm tra xem mảng 'tags' có chứa tag mục tiêu không
      return post.tags.some((tag) => tag.toLowerCase() === normalizedTag);
    }
    return false; // Loại bỏ post nếu không có mảng tags hợp lệ
  });
}

btnLeft.addEventListener("click", () => {
  topicContent.scrollBy({ left: -200, behavior: "smooth" });
});
btnRight.addEventListener("click", () => {
  topicContent.scrollBy({ left: 200, behavior: "smooth" });
});

topicContent.addEventListener("scroll", updateArrowsAndFade);
window.addEventListener("resize", updateArrowsAndFade);

// load Topic
topics.forEach((topic) => {
  topic.addEventListener("click", async function (e) {
    e.preventDefault();

    topics.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    const type = this.dataset.value;

    loadPostByTopic(type);
    updateArrows();
  });
});
// Scroll top

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

// Call Function
loadFollowedPost();
updateArrowsAndFade();
