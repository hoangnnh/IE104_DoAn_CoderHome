const postId = location.pathname.split("/").pop();
const postTitle = document.querySelector(".post__title-head");
const postHeader = document.querySelector(".post__header");
const postContent = document.querySelector(".post__content");
const postTags = document.querySelector(".post__tags");
const postAboutAuthor = document.querySelector(".post__about-author");
const postResponse = document.querySelector(".post__response");

async function loadComment() {
  const commentList = document.querySelector(".comment__list");
  const resComment = await fetch(`/comments/${postId}`);
  const comments = await resComment.json();

  console.log(resComment);
  console.log(comments);
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
                        <img src="/images/show-post-img/More action.svg" alt="more action button">
                    </button>
                </div>
                <p class="comment__content">${item.content}</p>
            </div>
            <hr class="post__divider"/>
        </li>
    `
    )
    .join("");
}

async function loadPostID() {
  const resPost = await fetch(`/posts/${postId}`);
  const post = await resPost.json();
  const resUser = await fetch(`/current/`);
  const currentUser = await resUser.json();

  postTitle.textContent = `${post.title}`;

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
                        <img src="/images/show-post-img/Comment.svg" alt="comment-icon" class="heart-icon"/>
                        <p>3.7K</p>
                    </div>
                    <div class="interaction__items">
                        <img src="/images/show-post-img/Heart.svg" alt="heart-icon" class="comment-icon"/>
                        <p>4.2K</p>
                    </div>
                </div>
                <div class="metadata__action">
                    <img src="/images/show-post-img/Close.svg" alt="" class="close-icon"/>
                    <img src="/images/show-post-img/Bookmark.svg" alt="" class="bookmark-icon"/>
                    <img src="/images/show-post-img/Share button.svg" alt="" class="share-icon"/>
                    <img src="/images/show-post-img/More action.svg" alt="" class="more-action-icon"/>
                </div>
            </div>
        </div>
`;

  postContent.innerHTML = `${post.contentHTML}`;
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

  postAboutAuthor.innerHTML = `
    <img src="${post.author.profilePicture}" alt="avatar" class="post__author-img"/>
        <div class="post__author-content">
            <a href="/profile/${post.author._id}" class="post__author-writenby">Writen by ${post.author.username}</a>
            <p class="post__author-bio">${post.author.bio}</p>
        </div>
    <button class="post__author-follow"><span>Follow</span></button>
    `;

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

  const textarea = document.getElementById("response-content");
  const form = document.querySelector(".response-form");
  const baseHeight = textarea.scrollHeight;

  textarea.addEventListener("focus", () => {
    form.classList.add("active");
  });

  textarea.addEventListener("blur", () => {
    if (!textarea.value.trim()) {
      form.classList.remove("active");
    }
  });

  const cancelBtn = document.querySelector(".respones__cancel");
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    textarea.value = "";
    textarea.style.height = baseHeight + "px";
    form.classList.remove("active");
  });

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  await loadComment();

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
