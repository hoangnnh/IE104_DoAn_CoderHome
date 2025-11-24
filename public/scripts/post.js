// Get postId from URL
const postId = location.pathname.split("/").pop();
// Get elements from HTML
const postTitle = document.querySelector(".post__title-head");
const postHeader = document.querySelector(".post__header");
const postContent = document.querySelector(".post__content");
const postTags = document.querySelector(".post__tags");
const postAboutAuthor = document.querySelector(".post__about-author");
const postResponse = document.querySelector(".post__response");

// Function to load comments
async function loadComment() {
  const commentList = document.querySelector(".comment__list");
  const resComment = await fetch(`/comments/${postId}`); // Call API to get comments by postId
  const comments = await resComment.json(); // Convert response to JSON

  console.log(resComment); // Check server response
  console.log(comments); // Check comment data

  // Create HTML for each comment and insert into comment list
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

function scrollToCommentSection() {
  const commentIcon = document.querySelector(".comment-icon");
  const commentSection = document.querySelector(".post__response");
  commentIcon.addEventListener("click", () => {
    commentSection.scrollIntoView({behavior: "smooth", block: "start"});
  });
}

// Function to load post by postId
async function loadPostID() {
  // Call API to get post and current user
  const resPost = await fetch(`/posts/${postId}`);
  const post = await resPost.json();
  // Get current user information
  const resUser = await fetch(`/current/`);
  const currentUser = await resUser.json();

  postTitle.textContent = `${post.title}`; // Update post title

  // Update post header section
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
                ${currentUser._id !== post.author._id ? `<button class="post__author-follow"><span>Follow</span></button>` : ""}
                <p class="post__posted-date">6 days</p>
            </div>
            <hr class="post__divider"/>
            <div class="metadata__interaction-action">
                <div class="metadata__interaction">
                    <div class="interaction__items">
                        <img src="/images/icons/comment-icon.svg" alt="comment-icon" class="comment-icon"/>
                        <span>3.7K</span>
                    </div>
                    <div class="interaction__items">
                        <img src="/images/icons/heart-icon.svg" alt="heart-icon" class="heart-icon"/>
                        <span>4.2K</span>
                    </div>
                </div>
                <div class="metadata__action">
                    <img src="/images/icons/bookmark-icon.svg" alt="" class="bookmark-icon"/>
                    <img src="/images/icons/share-icon.svg" alt="" class="share-icon"/>
                </div>
            </div>
        </div>
`;
  // Update post content
  postContent.innerHTML = `${post.contentHTML}`;
  // Update post tags
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

  // Update author section
  postAboutAuthor.innerHTML = `
    <img src="${post.author.profilePicture}" alt="avatar" class="post__author-img"/>
        <div class="post__author-content">
            <a href="/profile/${post.author._id}" class="post__author-writenby">Writen by ${post.author.username}</a>
            <p class="post__author-bio">${post.author.bio}</p>
        </div>
    <button class="post__author-follow"><span>Follow</span></button>
    `;

  // Update post response section
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

  // Handle textarea interaction for response
  const textarea = document.getElementById("response-content");
  const form = document.querySelector(".response-form");
  const baseHeight = textarea.scrollHeight;

  // Add active class when textarea is focused => expand form
  textarea.addEventListener("focus", () => {
    form.classList.add("active");
  });

  // Remove active class when textarea loses focus and is empty => collapse form
  textarea.addEventListener("blur", () => {
    if (!textarea.value.trim()) {
      form.classList.remove("active");
    }
  });

  // Handle cancel response button
  const cancelBtn = document.querySelector(".respones__cancel");
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    textarea.value = "";
    textarea.style.height = baseHeight + "px";
    form.classList.remove("active");
  });

  // Automatically adjust textarea height when typing
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  // Handle sending response when pressing Enter (without Shift)
  textarea.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line

      // Send response
      const content = textarea.value.trim();
      if (!content) return;

      // Call API to send response
      await fetch("/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, content }),
      });

      // Reset textarea and collapse form
      textarea.value = "";
      textarea.style.height = baseHeight + "px";
      form.classList.remove("active");

      await loadComment();
    }
  });

  // Load initial comments
  await loadComment();

  // Scroll to comment event
  scrollToCommentSection();

  // Like event
  const heartIcon = document.querySelector(".heart-icon");
  heartIcon.addEventListener("click", () => {
    heartIcon.classList.toggle("active");
    if (heartIcon.classList.contains("active")) {
      heartIcon.src = "/images/icons/heart-filled-icon.svg";
    } else {
      heartIcon.src = "/images/icons/heart-outline-icon.svg";
    }
  });

  // Bookmark event
  const bookmarkIcon = document.querySelector(".bookmark-icon");
  bookmarkIcon.addEventListener("click", () => {
    bookmarkIcon.classList.toggle("saved");
    if (bookmarkIcon.classList.contains("saved")) {
      bookmarkIcon.src = "/images/icons/bookmark-filled-icon.svg";
    } else {
      bookmarkIcon.src = "/images/icons/bookmark-outline-icon.svg";
    }
  })

  // Handle sending response on form submit
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
