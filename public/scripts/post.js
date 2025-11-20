// Lấy ID của bài post từ URL
const postId = location.pathname.split("/").pop();

// Lấy các phần tử DOM cần thao tác
const postTitle = document.querySelector(".post__title-head");
const postHeader = document.querySelector(".post__header");
const postContent = document.querySelector(".post__content");
const postTags = document.querySelector(".post__tags");
const postAboutAuthor = document.querySelector(".post__about-author");
const postResponse = document.querySelector(".post__response");

// Hàm tải bình luận của bài viết
async function loadComment() {
  const commentList = document.querySelector(".comment__list");

  // Lấy dữ liệu bình luận từ server
  const resComment = await fetch(`/comments/${postId}`);
  const comments = await resComment.json();

  console.log(resComment);
  console.log(comments);

  // Render bình luận ra DOM
  commentList.innerHTML = comments
    .map(
      (item) => `
        <li class="comment__list-item">
            <div class="item__container">
                <div class="item__header">
                    <div class="item__header-info">
                        <img src="${item.author.profilePicture}" alt="Responser's avatar" class="response__avatar">
                        <a href="/profile/${item.author._id}" class="comment__name">${item.author.username}</a>
                    </div>
                    <button class="more-action-btn">
                        <img src="/images/icons/three-dots-icon.svg" alt="more action button">
                    </button>
                </div>
                <div class="comment__content">${item.content}</div>
            </div>
            <hr class="post__divider"/>
        </li>
    `
    )
    .join("");
}

// Hàm tải thông tin bài viết
async function loadPostID() {
  // Lấy dữ liệu bài viết từ server
  const resPost = await fetch(`/posts/${postId}`);
  const post = await resPost.json();

  // Lấy dữ liệu user hiện tại
  const resUser = await fetch(`/current/`);
  const currentUser = await resUser.json();

  // Hiển thị tiêu đề bài viết
  postTitle.textContent = `${post.title}`;

  // Render phần header của bài viết
  postHeader.innerHTML = `
    <p class="post__title">${post.title}</p>
    <p class="post__description">${post.description}</p>
        <div class="post__metadata">
            <div class="post__author">
                <img src="${post.author.profilePicture}" alt="avatar"
                    class="post__author-img" />
                <a href="/profile/${post.author._id}" class="post__author-name">
                    ${post.author.username}
                </a>
                <button class="post__author-follow">
                    <span>Follow</span>
                </button>
                <p class="post__posted-date">6 days</p>
            </div>
            <hr class="post__divider"/>
            <div class="metadata__interaction-action">
                <div class="metadata__interaction">
                    <div class="interaction__items">
                        <img src="/images/icons/comment-icon.svg" alt="comment-icon" class="heart-icon"/>
                        <p>3.7K</p>
                    </div>
                    <div class="interaction__items">
                        <img src="/images/icons/heart-icon.svg" alt="heart-icon" class="comment-icon"/>
                        <p>4.2K</p>
                    </div>
                </div>
                <div class="metadata__action">
                    <img src="/images/icons/remove-icon.svg" alt="" class="close-icon"/>
                    <img src="/images/icons/bookmark-icon.svg" alt="" class="bookmark-icon"/>
                    <img src="/images/icons/share-icon.svg" alt="" class="share-icon"/>
                </div>
            </div>
        </div>
`;

  // Hiển thị nội dung bài viết
  postContent.innerHTML = `${post.contentHTML}`;

  // Render các tag của bài viết
  postTags.innerHTML = post.tags
    .map(
      (tag, index) => `
        <button class="post__tags-button">
            <span>
                ${tag}
            </span>
        </button>
    `
    )
    .join("");

  // Hiển thị thông tin tác giả
  postAboutAuthor.innerHTML = `
    <img src="${post.author.profilePicture}" alt="avatar" class="post__author-img"/>
        <div class="post__author-content">
            <a href="/profile/${post.author._id}" class="post__author-writenby">Writen by ${post.author.username}</a>
            <p class="post__author-bio">${post.author.bio}</p>
        </div>
    <button class="post__author-follow"><span>Follow</span></button>
    `;

  // Render phần phản hồi của bài viết (form comment)
  postResponse.innerHTML = `
    <p class="post__respones-title">Responses</p>
                    <a href="/profile/${currentUser._id}" class="user__info">
                        <img src="${currentUser.profilePicture}" alt="avatar" class="user__avatar" />
                        <p class="user__name"> ${currentUser.username}</p>
                    </a>
                        <form class="response-form">
                            <div class="response-input">
                                <textarea id="response-content" placeholder="What are your thoughts?"></textarea>
                            </div>
                            <div class="respones__nav">
                                <button class="respones__cancel">
                                    Cancel
                                </button>
                                <button class="respones__respond" type="submit">
                                    Respond
                                </button>
                            </div>
                        </form>
    `;

  // Lấy textarea và form để xử lý sự kiện
  const textarea = document.getElementById("response-content");
  const form = document.querySelector(".response-form");
  const baseHeight = textarea.scrollHeight;

  // Khi textarea được focus, thêm class active
  textarea.addEventListener("focus", () => {
    form.classList.add("active");
  });

  // Khi blur, nếu textarea rỗng thì bỏ class active
  textarea.addEventListener("blur", () => {
    if (!textarea.value.trim()) {
      form.classList.remove("active");
    }
  });

  // Nút hủy phản hồi
  const cancelBtn = document.querySelector(".respones__cancel");
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    textarea.value = "";
    textarea.style.height = baseHeight + "px";
    form.classList.remove("active");
  });

  // Tự động điều chỉnh chiều cao textarea theo nội dung
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  // Tải các bình luận hiện tại
  await loadComment();

  // Xử lý submit bình luận mới
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = textarea.value.trim();

    await fetch("/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, content }),
    });

    // Xóa nội dung textarea và reload bình luận
    textarea.value = "";
    await loadComment();
  });
}

// Gọi hàm loadPostID khi vào trang
loadPostID();
