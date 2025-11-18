const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q") || "";

const scrollTopBtn = document.getElementById("scrollTopBtn");
const tabs = document.querySelectorAll(".nav__items");

const userTab = document.getElementById("tab-users");
const postTab = document.getElementById("tab-posts");
const resultContainer = document.getElementById("main__content");

async function fetchSearch(type, keyword) {
  const res = await fetch(
    `/search?type=${type}&q=${encodeURIComponent(keyword)}`
  );
  const data = await res.json();
  return data;
}

async function loadPosts() {
  const posts = await fetchSearch("posts", query);
  const container = document.querySelector(".main__content");
  container.innerHTML = ``;
  if (!posts.length) {
    container.innerHTML = `<p style="display: flex; justify-content: center; font-size: 2.5rem; font-weight: bold;">No post found!</p>`;
    return;
  }
  container.innerHTML = posts
    .map(
      (post) =>
        ` 
        <hr class="divider">
        <article class="post__card">
        <div class="post__author">
            <img src="${
              post.author.profilePicture
            }" alt="author" class="post__author-img"/>
                <a href="/profile/${
                  post.author._id
                }" class="post__author-name">${
          post.author.username || "Unknown"
        }</a>
        </div>
        <div class="post__left">
            <div class="post__left-text">
                <div class="post__content">
                    <a href="/post/${post._id}" class="post__content-title">${
          post.title
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
                        <span style="display: flex; align-items: center; gap: 0.5rem"><img src="/images/icons/heart-icon.svg" class="react-icon-meta" style="display: inline;"/> 5.5K</span>
                        <span style="display: flex; align-items: center; gap: 0.5rem"><img src="/images/icons/comment-icon.svg" class="react-icon-meta" style="display: inline;"/> 170</span>
                    </div>
                    <div class="post__interact-action">
                        <button class="icon-btn"><img src="/images/icons/remove-icon.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/icons/bookmark-icon.svg" class="react-icon"/></button>
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
}
async function loadUsers() {
  const users = await fetchSearch("users", query);
  const container = document.querySelector(".main__content");
  container.innerHTML = ``;

  if (!users.length) {
    container.innerHTML = `<p style="display: flex; justify-content: center; font-size: 2.5rem; font-weight: bold;">No user found!</p>`;
    return;
  }
  container.innerHTML = users
    .map(
      (user) =>
        `
            <div class="user__list-item">
                <div class="user__info">
                    <img src="${user.profilePicture}" alt="Blogger's avatar" class="avatar">
                    <div class="content">
                        <a href="/profile/${user._id}" style="font-weight: bold;" class="name">${user.username}</a>
                    <p class="bio">${user.bio}</p>
                </div>
                </div>
                <button class="follow__btn">
                Follow
                </button>
            </div>
            <hr class="divider">
        `
    )
    .join("");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", async function (e) {
    e.preventDefault();

    tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    const type = this.dataset.tab;

    if (type === "post") {
      loadPosts();
      userTab.classList.remove("active");
    } else if (type === "user") {
      loadUsers();
      userTab.classList.add("active");
    }
  });
});

// Scroll top

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Call Function
loadPosts();
