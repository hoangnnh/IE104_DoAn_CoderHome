// lấy postId từ URL
const postId = location.pathname.split("/").pop();
// Lấy các phần từ HTML
const postTitle = document.querySelector(".post__title-head");
const postHeader = document.querySelector(".post__header");
const postContent = document.querySelector(".post__content");
const postTags = document.querySelector(".post__tags");
const postAboutAuthor = document.querySelector(".post__about-author");
const postResponse = document.querySelector(".post__response");

// Hàm tải bình luận
async function loadComment() {
  const commentList = document.querySelector(".comment__list");
  const resComment = await fetch(`/comments/${postId}`); // Gọi API lấy bình luận theo postId
  const comments = await resComment.json(); // Chuyển đổi phản hồi thành JSON

  console.log(resComment); //Kiểm tra phản hồi từ server
  console.log(comments); //Kiểm tra dữ liệu bình luận

  // Tạo HTML cho từng bình luận và chèn vào danh sách bình luận
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

// Hàm tải bài viết theo postId
async function loadPostID() {
  // Gọi API lấy bài viết và người dùng hiện tại
  const resPost = await fetch(`/posts/${postId}`);
  const post = await resPost.json();
  // Lấy thông tin người dùng hiện tại
  const resUser = await fetch(`/current/`);
  const currentUser = await resUser.json();

  postTitle.textContent = `${post.title}`; // Cập nhật tiêu đề bài viết

  // Cập nhật phần header bài viết
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
  // Cập nhật nội dung bài viết
  postContent.innerHTML = `${post.contentHTML}`;
  // Cập nhật thẻ bài viết
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

  // Cập nhật phần về tác giả
  postAboutAuthor.innerHTML = `
    <img src="${post.author.profilePicture}" alt="avatar" class="post__author-img"/>
        <div class="post__author-content">
            <a href="/profile/${post.author._id}" class="post__author-writenby">Writen by ${post.author.username}</a>
            <p class="post__author-bio">${post.author.bio}</p>
        </div>
    <button class="post__author-follow"><span>Follow</span></button>
    `;

  // Cập nhật phần phản hồi bài viết
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

  // Xử lý tương tác với textarea phản hồi
  const textarea = document.getElementById("response-content");
  const form = document.querySelector(".response-form");
  const baseHeight = textarea.scrollHeight;

  // Thêm lớp active khi textarea được focus => mở rộng form
  textarea.addEventListener("focus", () => {
    form.classList.add("active");
  });

  // Loại bỏ lớp active khi textarea mất focus và không có nội dung => thu gọn form
  textarea.addEventListener("blur", () => {
    if (!textarea.value.trim()) {
      form.classList.remove("active");
    }
  });

  // Xử lý nút hủy phản hồi => nút Cancel
  const cancelBtn = document.querySelector(".respones__cancel");
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    textarea.value = "";
    textarea.style.height = baseHeight + "px";
    form.classList.remove("active");
  });

  // Tự động điều chỉnh chiều cao của textarea khi nhập nội dung
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  // Xử lý gửi phản hồi khi nhấn Enter (không kèm Shift)
  textarea.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Không xuống dòng

      // Gửi phản hồi
      const content = textarea.value.trim();
      if (!content) return;

      // Gọi API để gửi phản hồi
      await fetch("/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, content }),
      });

      // Reset textarea và thu gọn form
      textarea.value = "";
      textarea.style.height = baseHeight + "px";
      form.classList.remove("active");

      await loadComment();
    }
  });

  // Tải bình luận ban đầu
  await loadComment();

  // Xử lý gửi phản hồi khi submit form
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
    textarea.value = "";
    await loadComment();
  });
}
loadPostID();
