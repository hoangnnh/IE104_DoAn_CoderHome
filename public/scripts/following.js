import { handleLikeClick, handleBookmarkClick } from "/scripts/helpers.js";
import { renderPostCard } from "/scripts/components/post-card.js";
// import { all } from "../../routes/profiles";

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
    container.innerHTML = posts.map((p) => renderPostCard(p, 1, 0)).join("");

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
      .map((p) => renderPostCard(p, 1, 0))
      .join("");

    handleLikeClick();
    handleBookmarkClick();
  } else {
    container.innerHTML = `
    <p  class="error__not-found">Can't find post of this Topic! It's maybe you haven't Follow any one yet Or no post of this topic!!</p>
    `;
  }
}
async function loadFollowedAuthor() {
  const res = await fetch(`/current/`);
  const currentUser = await res.json();

  const res2 = await fetch(`/profiles/`);
  const allAuthor = await res2.json();

  const container = document.querySelector(".main__content");

  const followingIds = currentUser.followingAuthors.map(
    (author) => author._id || author
  );
  const filteredAuthors = allAuthor.filter((author) => {
    return author._id !== currentUser && followingIds.includes(author._id);
  });

  container.innerHTML = filteredAuthors
    .map(
      (author) => `
            <div class="user__list-item">
              <div class="user__info">
                <img src="${author.profilePicture}" alt="Blogger's avatar" class="avatar">
                <div class="content">
                  <a href="/profile/${author._id}" style="font-weight: bold;" class="name">${author.username}</a>
                  <p class="bio">${author.bio}</p>
                </div>
              </div>
              <button class="follow__btn active" data-value="${author._id}">
                Following
              </button>
            </div>
            <hr class="divider">
  `
    )
    .join("");
}

async function loadUnfollowedAuthor() {
  console.log("loadAuthor called");
  try {
    const res = await fetch(`/profiles/`);
    const allAuthor = await res.json();
    const res2 = await fetch(`/current/`);
    const currentUser = await res2.json();
    const container = document.querySelector(".main__content");

    const followingIds = currentUser.followingAuthors.map(
      (author) => author._id || author
    );
    const filteredAuthors = allAuthor.filter((author) => {
      return (
        author._id !== currentUser._id && !followingIds.includes(author._id)
      );
    });

    container.innerHTML = filteredAuthors
      .map(
        (author) => `
            <div class="user__list-item">
              <div class="user__info">
                <img src="${author.profilePicture}" alt="Blogger's avatar" class="avatar">
                <div class="content">
                  <a href="/profile/${author._id}" style="font-weight: bold;" class="name">${author.username}</a>
                  <p class="bio">${author.bio}</p>
                </div>
              </div>
              <button class="follow__btn" data-value="${author._id}">
                Follow
              </button>
            </div>
            <hr class="divider">
    `
      )
      .join("");
    console.log("Success");
  } catch (err) {
    console.log("Fail");
  }
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
// Responsive

// -------- Const

const container = document.querySelector(".main__content");
// following nav
const tabs = document.querySelectorAll(".nav__items");
// post nav
const postNavs = document.querySelectorAll(".post-nav__items");
//author nav
const authorNavs = document.querySelectorAll(".author-nav__items");
//
const topicContent = document.querySelector(".topic__content");
//
const dropdownHeader = document.querySelector(".dropdown__header");
const dropdownHeaderItem = document.querySelector(".dropdown__header-item");
const arrow = document.querySelector(".arrow");
const selection = document.querySelector(".dropdown__selection");
const dropdownItems = document.querySelectorAll(".dropdown__item");
const dropdown = document.querySelector(".dropdown__container");
const topics = document.querySelectorAll(".topic");
const fadeLeft = document.querySelector(".fade-left");
const fadeRight = document.querySelector(".fade-right");
const btnLeft = document.getElementById("scrollLeft");
const btnRight = document.getElementById("scrollRight");
//
const postNav = document.querySelector(".post__nav");
const authorNav = document.querySelector(".author__nav");
const topicNav = document.querySelector(".topic__nav");
//
const scrollBtn = document.querySelector(".scroll-top");
//Event

// Khi bấm vào mỗi tab following nav
function activateNav({ post = false, author = false, topic = false }) {
  postNav.classList.toggle("active", post);
  authorNav.classList.toggle("active", author);
  topicNav.classList.toggle("active", topic);
}

function setActiveTab(clickedTab, tabGroup) {
  tabGroup.forEach((t) => t.classList.remove("active"));
  clickedTab.classList.add("active");
}
function resetAllActive() {
  // Reset active của nav chính
  tabs.forEach((t) => t.classList.remove("active"));
  // Reset post tabs
  postNavs.forEach((t) => t.classList.remove("active"));
  // Reset author tabs
  authorNavs.forEach((t) => t.classList.remove("active"));
}

function setDefaultSubTab(type) {
  if (type === "post") {
    const allTab = document.querySelector('.post-nav__items[data-tab="all"]');
    if (allTab) allTab.classList.add("active");
  }
  if (type === "author") {
    const followedTab = document.querySelector(
      '.author-nav__items[data-tab="followed"]'
    );
    if (followedTab) followedTab.classList.add("active");
  }
}

async function handleTabClick(tab, tabGroup) {
  const type = tab.dataset.tab;
  // Reset toàn bộ active cũ trước khi set mới
  resetAllActive();
  // Active tab hiện tại
  tab.classList.add("active");
  switch (type) {
    case "post":
      activateNav({ post: true, author: false, topic: false });
      setDefaultSubTab("post");
      await loadFollowedPost();
      break;
    case "author":
      activateNav({ post: false, author: true, topic: false });
      setDefaultSubTab("author");
      await loadFollowedAuthor();
      break;
    case "all":
      activateNav({ post: true, author: false, topic: false });

      // Active đúng sub-tab
      tab.classList.add("active");

      await loadFollowedPost();
      break;
    case "topic":
      activateNav({ post: true, author: false, topic: true });

      tab.classList.add("active");

      const activeTopic = document.querySelector(".topic.active");
      if (activeTopic) {
        await loadPostByTopic(activeTopic.dataset.value);
      } else {
        await loadFollowedPost();
      }

      updateArrowsAndFade();
      break;
    case "followed":
      activateNav({ post: false, author: true, topic: false });

      tab.classList.add("active");
      await loadFollowedAuthor();
      break;
    case "more":
      activateNav({ post: false, author: true, topic: false });

      tab.classList.add("active");
      await loadUnfollowedAuthor();
      break;
  }
}

// Gắn sự kiện
tabs.forEach((tab) =>
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    handleTabClick(tab, tabs);
  })
);
postNavs.forEach((tab) =>
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    handleTabClick(tab, postNavs);
  })
);
authorNavs.forEach((tab) =>
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    handleTabClick(tab, authorNavs);
  })
);

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

// Hàm cập nhât Topic arrow và làm mờ
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
// Hàm lọc post theo Tags
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

// Nút chuyển trên Topic nav
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

// Follow Btn
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

// Default UI on page load

// Default load
loadFollowedPost();
updateArrowsAndFade();
