const postId = location.pathname.split("/").pop();
const postTitle = document.querySelector(".post__title-head")
const postHeader = document.querySelector(".post__header");
const postContent = document.querySelector(".post__content");
const postTags = document.querySelector(".post__tags");
const postAboutAuthor = document.querySelector(".post__about-author");
const postResponse = document.querySelector(".post-respone");

async function loadPostID() {
    const res = await fetch(`/posts/${postId}`);
    const post = await res.json();

    postTitle.textContent = `${post.title}`;

    postHeader.innerHTML = `
    <p class="post__title">${post.title}</p>
                    <p class="post__description">
                        ${post.overview}
                    </p>
                    <div class="post__metadata">
                        <div class="post-author">
                            <img src="${post.author.profilePicture}" alt="avatar"
                                class="post-author__img" />
                            <p class="post-author__name">
                                ${post.author.username}
                            </p>
                            <button class="post-author__follow">
                                <span>Follow</span>
                            </button>
                            <p class="post__posted-date">6 days</p>
                        </div>
                        <hr class="post__divider" />
                        <div class="metadata__interaction-action">
                            <div class="metadata__interaction">
                                <div class="interaction__items">
                                    <img src="/images/show-post-img/Comment.svg" alt="comment-icon" />
                                    <p>3.7K</p>
                                </div>
                                <div class="interaction__items">
                                    <img src="/images/show-post-img/Heart.svg" alt="heart-icon" />
                                    <p>4.2K</p>
                                </div>
                            </div>
                            <div class="metadata__action">
                                <img src="/images/show-post-img/Close.svg" alt="" />
                                <img src="/images/show-post-img/Bookmark.svg" alt="" />
                                <img src="/images/show-post-img/Share button.svg" alt="" />
                                <img src="/images/show-post-img/More action.svg" alt="" />
                            </div>
                        </div>
                    </div>
`;

    postContent.innerHTML = `${post.content}`;
    postTags.innerHTML = post.tags.map((tag, index) => `
        <button class="post__tags-button">
            <span>
                ${tag}
            </span>
        </button>
    `).join("");

    postAboutAuthor.innerHTML = `
    <img src="${post.author.profilePicture}" alt="avatar" class="about-author__img"/>
        <div class="about-author__content">
            <p class="about-author__writenby">Writen by ${post.author.username}</p>
            <p class="about-author__bio">${post.author.bio}</p>
        </div>
    <button class="about-author__follow"><span>Follow</span></button>
    `;

    postResponse.innerHTML = `
    <p class="post-respones__count">Respones()</p>
                    <div class="user__info">
                        <img src="${post.author.profilePicture}" alt="avatar" class="user__avatar" />
                        <p class="user__name"> ${post.author.username}</p>
                    </div>
                        <div class="post-respone__input">
                            <input type="text" name="post-respone" id="post-respone"
                                placeholder="Write your comment..." />
                            <div class="respones__nav">
                                <button class="respones__cancel">
                                    <span>Cancel</span>
                                </button>
                                <button class="respones__respond">
                                    <span>Respond</span>
                                </button>
                            </div>
                        </div>
    `
}
loadPostID();