const userId = location.pathname.split("/").pop();

// Function
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

async function loadNav(params) {}
async function loadPost() {
  const res = await fetch(`/posts/`);
  const posts = await res.json();
  const container = document.querySelector(".main__content");
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
          post.author?.username || "Unknown"
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
                        <span><img src="/images/show-post-img/Heart.svg" class="react-icon-meta" style="display: inline;"/> 5.5K</span>
                        <span><img src="/images/show-post-img/Comment.svg" class="react-icon-meta" style="display: inline;"/> 170</span>
                    </div>
                    <div class="post__interact-action">
                        <button class="icon-btn"><img src="/images/minus-circle-outline.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/bookmark-outline.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/dots-horizontal.svg" class="react-icon"/></button>
                    </div>
                </div>
            </div>
            <img src="/images/post-thumbnail.png" class="post__img"/>
        </div>
        </article>
    `
    )
    .join("");
}
async function loadPostByTopic(topic) {
  const res = await fetch("/posts/");
  const posts = res.json();
  const filteredPosts = filterPostsByTag(posts, topic);
  const container = document.querySelector(".main__content");

  if (filteredPosts && filteredPosts.length > 0) {
    container.innerHTML = filteredPosts
      .map(
        (post) => `
        <hr class="divider">
        <article class="post__card">
        <div class="post__author">
            <img src="${
              post.author.profilePicture
            }" alt="author" class="post__author-img"/>
                <a href="/profile/${
                  post.author._id
                }" class="post__author-name">${
          post.author?.username || "Unknown"
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
                        <span><img src="/images/show-post-img/Heart.svg" class="react-icon-meta" style="display: inline;"/> 5.5K</span>
                        <span><img src="/images/show-post-img/Comment.svg" class="react-icon-meta" style="display: inline;"/> 170</span>
                    </div>
                    <div class="post__interact-action">
                        <button class="icon-btn"><img src="/images/minus-circle-outline.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/bookmark-outline.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/dots-horizontal.svg" class="react-icon"/></button>
                    </div>
                </div>
            </div>
            <img src="/images/post-thumbnail.png" class="post__img"/>
        </div>
        </article>
    `
      )
      .join("");
  } else {
    container.innerHTML = `
    <hr class="divider"></hr>
    <p  class="error__not-found">Post Not Found!!</p>
    `;
  }
}

// Call Function
loadPost();

// Responsive

// Event
const btnLeft = document.getElementById("scrollLeft");
const btnRight = document.getElementById("scrollRight");
const dropdownHeader = document.querySelector(".dropdown__header");
const dropdownHeaderItem = document.querySelector(".dropdown__header-item");
const selection = document.querySelector(".dropdown__selection");
const dropdownItems = document.querySelectorAll(".dropdown__item");
const dropdown = document.querySelector(".dropdown__container");

//
//

dropdownHeader.addEventListener("click", (e) => {
  e.preventDefault();
  dropdown.classList.toggle("active");
});
dropdownItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const selected = item.getAttribute("data-value");
    dropdownHeaderItem.textContent = selected;
    dropdown.classList.remove("active");
  });
});

// --------Test--------
// function updateArrows() {
//   const scrollLeft = nav.scrollLeft;
//   const maxScroll = nav.scrollWidth - nav.clientWidth;

//   btnLeft.style.display = scrollLeft > 5 ? "block" : "none";
//   btnRight.style.display = scrollLeft < maxScroll - 5 ? "block" : "none";
// }

// btnLeft.addEventListener("click", () => {
//   nav.scrollBy({ left: -150, behavior: "smooth" });
// });
// btnRight.addEventListener("click", () => {
//   nav.scrollBy({ left: 150, behavior: "smooth" });
// });

// nav.addEventListener("scroll", updateArrows);
// window.addEventListener("resize", updateArrows);
// updateArrows();
