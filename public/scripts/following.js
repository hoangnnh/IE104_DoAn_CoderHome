import { handleLikeClick, handleBookmarkClick } from "/scripts/helpers.js";
import { renderPostCard } from "/scripts/components/post-card.js";
// import { all } from "../../routes/profiles";

const container = document.querySelector(".main__content");
// Fetch
async function getCurrentAndPosts() {
  const [userRes, postRes] = await Promise.all([
    fetch("/current/"),
    fetch("/posts/"),
  ]);

  const user = await userRes.json();
  const posts = await postRes.json();

  return { user, posts };
}
async function getCurrentAndAuthors() {
  const [userRes, authorsRes] = await Promise.all([
    fetch("/current/"),
    fetch("/profiles/"),
  ]);

  const user = await userRes.json();
  const authors = await authorsRes.json();

  return { user, authors };
}

//
async function loadFollowedPost() {
  const { user, posts: allposts } = await getCurrentAndPosts();

  const followingIds = user.followingAuthors.map((id) => id.toString());

  const posts = allposts
    .filter((post) => followingIds.includes(post.author?._id))
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
  const { user, posts: allposts } = await getCurrentAndPosts();

  const followingIds = user.followingAuthors.map((id) => id.toString());

  const filteredTopicPosts = filterPostsByTag(allposts, topic);

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
  const { user: currentUser, authors: allAuthors } =
    await getCurrentAndAuthors();

  const followingIds = currentUser.followingAuthors.map(
    (author) => author._id || author
  );

  const filteredAuthors = allAuthors.filter((author) => {
    return author._id !== currentUser._id && followingIds.includes(author._id);
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
  const { user: currentUser, authors: allAuthors } =
    await getCurrentAndAuthors();

  const followingIds = currentUser.followingAuthors.map(
    (author) => author._id || author
  );
  const filteredAuthors = allAuthors.filter((author) => {
    return author._id !== currentUser._id && !followingIds.includes(author._id);
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

// -------- Const --------------------------------
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

// ---------------- Event ------------------------------------

// Khi bấm vào mỗi tab following nav
function activateNav({ post = false, author = false, topic = false }) {
  postNav.classList.toggle("active", post);
  authorNav.classList.toggle("active", author);
  topicNav.classList.toggle("active", topic);
}

// Các hàm reset active của nav
function resetActive(list) {
  list.forEach((t) => t.classList.remove("active"));
}

//
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
//hàm xử lý
async function handleTabClick(tab) {
  const type = tab.dataset.tab;

  // Active tab hiện tại
  tab.classList.add("active");
  switch (type) {
    case "post": //Khi nhấn post
      activateNav({ post: true, author: false, topic: false });
      resetActive(postNavs);
      setDefaultSubTab("post"); //Mặc định khi vào post sẽ là All

      await loadFollowedPost();
      break;
    case "author": //Khi nhấn author
      activateNav({ post: false, author: true, topic: false });
      resetActive(authorNavs);
      setDefaultSubTab("author"); //Mặc định khi vào author sẽ là followed
      await loadFollowedAuthor();
      break;
    case "all": //Khi nhấn all
      activateNav({ post: true, author: false, topic: false });

      await loadFollowedPost();
      break;
    case "topic": // Khi nhấn topic
      activateNav({ post: true, author: false, topic: true });

      const activeTopic = document.querySelector(".topic.active");
      if (activeTopic) {
        await loadPostByTopic(activeTopic.dataset.value);
      } else {
        await loadFollowedPost();
      }
      updateArrowsAndFade();
      break;
    case "followed": // Khi nhấn follwoed
      activateNav({ post: false, author: true, topic: false });

      await loadFollowedAuthor();
      break;
    case "more": // Khi nhấn more
      activateNav({ post: false, author: true, topic: false });

      await loadUnfollowedAuthor();
      break;
  }
}

// Gắn sự kiện
tabs.forEach(
  (
    tab //Khi nhán nav trên cùng
  ) =>
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      resetActive(tabs);
      handleTabClick(tab, tabs);
    })
);
postNavs.forEach(
  (
    tab //Khi nhấn post nav
  ) =>
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      resetActive(postNavs);
      handleTabClick(tab, postNavs);
    })
);
authorNavs.forEach(
  (
    tab //Khi nhấn author nav
  ) =>
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      resetActive(authorNavs);
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
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const mainTab = params.get("tab") || "post";
  const authorTab = params.get("authorTab") || "followed";
  const postTab = params.get("postTab") || "all";

  // Reset all UI
  resetActive(tabs);
  resetActive(postNavs);
  resetActive(authorNavs);

  // ===== TAB CHÍNH =====
  const mainTabs = document.querySelectorAll(".nav__items");
  mainTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === mainTab);
  });

  // ===== XỬ LÝ HIỂN THỊ NAV =====
  if (mainTab === "author") {
    activateNav({ post: false, author: true, topic: false });

    // Active đúng author sub-tab
    const authorTabs = document.querySelectorAll(".author-nav__items");

    authorTabs.forEach((tab) => {
      const isActive = tab.dataset.tab === authorTab;
      tab.classList.toggle("active", isActive);
    });

    // Load data đúng tab
    if (authorTab === "more") {
      loadUnfollowedAuthor();
    } else {
      loadFollowedAuthor();
    }
  } else if (mainTab === "post") {
    activateNav({ post: true, author: false, topic: false });

    const postTabs = document.querySelectorAll(".post-nav__items");

    postTabs.forEach((tab) => {
      const isActive = tab.dataset.tab === postTab;
      tab.classList.toggle("active", isActive);
    });

    if (postTab === "topic") {
      activateNav({ post: true, author: false, topic: true });
      const activeTopic = document.querySelector(".topic.active");

      if (activeTopic) {
        loadPostByTopic(activeTopic.dataset.value);
      } else {
        loadFollowedPost();
      }
      updateArrowsAndFade();
    } else {
      loadFollowedPost();
      updateArrowsAndFade();
    }
  }
});
