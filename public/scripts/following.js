import { handleLikeClick, handleBookmarkClick } from "/scripts/helpers.js";
import { renderPostCard } from "/scripts/components/post-card.js";

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
  if (posts && posts.length > 0) {
    container.innerHTML = posts
      .map(p => renderPostCard(p, 1, 0)).join("");

    handleLikeClick();
    handleBookmarkClick();
  } else {
    container.innerHTML = `
    <p  class="error__not-found">You haven't Follow any one yet!!</p>
    `;
  }
}

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
      .map(p => renderPostCard(p, 1, 0)).join("");

    handleLikeClick();
    handleBookmarkClick();
  } else {
    container.innerHTML = `
    <p  class="error__not-found">Can't find post of this Topic! It's maybe you haven't Follow any one yet Or no post of this topic!!</p>
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
    updateArrowsAndFade();
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
