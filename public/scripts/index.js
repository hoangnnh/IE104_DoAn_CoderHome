import { getRandomLikeCount, handleLikeClick, handleBookmarkClick } from "/scripts/helpers.js";

// Lấy phần tử giao diện
// Get UI elements
const coderHome = document.querySelector(".coderhome"); // Tab Coderhome
const devTo = document.querySelector(".devto"); // Tab Dev.to
const scrollBtn = document.getElementById("scrollTopBtn"); // Nút scroll to top

// Biến trạng thái phân trang
// Pagination state variables
let currentPage = 1;
let currentTab = "coderhome";
let isLoading = false; // Ngăn load trùng
let hasMore = true; // Còn bài để load hay không
const posts_per_page = 10;

// ---------------------------------------------
// Load bài viết từ Coderhome
// Load Coderhome posts
// ---------------------------------------------
async function loadCoderhomePost(isInitial = true) {
  if (isInitial) {
    // Reset phân trang khi load lần đầu
    // Reset pagination for initial load
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

  if (isLoading || !hasMore) return; // Nếu đang load hoặc hết bài → thoát
  isLoading = true;

  try {
    // Lấy tất cả bài viết từ DB
    // Fetch all posts from database
    const res = await fetch("/posts/");
    const allPosts = await res.json();

    // Tính vị trí bài trong 1 lần load
    // Calculate post slice for current page
    const startIndex = (currentPage - 1) * posts_per_page;
    const endIndex = startIndex + posts_per_page;
    const posts = allPosts.slice(startIndex, endIndex);

    // Kiểm tra còn bài hay không
    // Check if more posts exist
    hasMore = endIndex < allPosts.length;

    const container = document.querySelector(".post");

    // Xóa bài cũ khi load tab mới
    // Clear container on initial load
    if (isInitial) {
      container.innerHTML = "";
    }

    // Render danh sách bài viết
    // Render post list
    const postsHTML = posts
      .map((p, index) => {
        const isLastInBatch = index === posts.length - 1;
        const showDivider = !isLastInBatch || hasMore; // Hiện HR nếu còn dữ liệu

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
                    <span>${getRandomLikeCount()}</span> <!-- Random số like -->
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

    // Thêm event like + bookmark sau khi render
    // Rebind like & bookmark handlers
    handleLikeClick();
    handleBookmarkClick();

    currentPage++; // Tăng trang

  } catch (err) {
    console.error("Error loading Coderhome posts:", err);
  } finally {
    isLoading = false;
  }
}

// ---------------------------------------------
// Load bài viết từ Dev.to
// Load Dev.to posts
// ---------------------------------------------
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
    // Lấy bài viết từ Dev.to API
    // Fetch posts from Dev.to API
    const res = await fetch(
      `https://dev.to/api/articles?page=${currentPage}&per_page=${posts_per_page}`
    );
    const posts = await res.json();

    // Kiểm tra còn bài không
    hasMore = posts.length === posts_per_page;

    const container = document.querySelector(".post");

    if (isInitial) container.innerHTML = "";

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

// ---------------------------------------------
// Infinite Scroll để load thêm bài
// Infinite scroll handler
// ---------------------------------------------
function handleScroll() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Kiểm tra user gần chạm đáy 200px
  // Check if near bottom
  const isNearBottom = scrollTop + windowHeight >= documentHeight - 200;
  
  if (isNearBottom && !isLoading && hasMore) {
    if (currentTab === "coderhome") loadCoderhomePost(false);
    else if (currentTab === "devto") loadDevToPost(false);
  }
}

// ---------------------------------------------
// Xóa bài viết (chỉ ẩn UI, không xóa DB)
// Remove post from UI only
// ---------------------------------------------
document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-post");
  if (!removeBtn) return;
  
  const postCard = removeBtn.closest(".post__card");

  if (postCard) {
    postCard.classList.add("hidden"); // Thêm hiệu ứng CSS
    setTimeout(() => {
      postCard.style.display = "none"; // Ẩn hoàn toàn
    }, 400);
  }
});

// Follow/unfollow button
document.querySelectorAll(".follow__btn").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("followed");
    item.textContent = item.classList.contains("followed") ? "Following" : "Follow";
  })
});

// Chuyển tab
coderHome.addEventListener("click", () => loadCoderhomePost(true));
devTo.addEventListener("click", () => loadDevToPost(true));

// Lắng nghe scroll
window.addEventListener("scroll", handleScroll);

// Hiện nút scroll-to-top
window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 200 ? "block" : "none";
});

// Cuộn lên đầu trang
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Load lần đầu
document.addEventListener("DOMContentLoaded", () => {
  loadCoderhomePost(true);
});
