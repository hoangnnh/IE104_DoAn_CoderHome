const userId = location.pathname.split("/").pop();

async function loadUserInfo() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  const userInfo = document.querySelector(".user__info");
  userInfo.innerHTML = `
  <img
      src="${user.profilePicture}"
      alt="user-avatar"
      class="user__avatar"
  />
  <p class="user__name">${user.username}</p>
  `;
}

async function loadPostedPost() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  const postedPostContainer = document.querySelector(".profile-content");
  if (user.postedPost && user.postedPost.length > 0) {
    postedPostContainer.innerHTML = user.postedPost
      .map(
        (post) => `
          <div class="post__card">
            <div class="post__author">
              <img
                src="${post.author.profilePicture}"
                alt="author's image"
                class="post__author-img"
              />
              <p class="post__author-name">${post.author.username}</p>
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
                    <span class="created_date">
                      ${new Date(post.createdAt).toDateString()}
                    </span>
                    <span>
                      <img
                        src=""
                        alt=""
                        class="react-icon"
                        style="display: inline"
                      />
                      5.5K
                    </span>
                    <span>
                      <img
                        src="/images/chat-outline.svg"
                        alt=""
                        class="react-icon"
                        style="display: inline"
                      />
                      170
                    </span>
                  </div>
                  <div class="post__interact-action">
                    <button class="icon-btn" aria-label="Not interested">
                      <img
                        src="/images/minus-circle-outline.svg"
                        alt="a"
                        class="react-icon"
                      />
                    </button>
                    <button class="icon-btn" aria-label="Bookmark">
                      <img
                        src="/images/bookmark-outline.svg"
                        alt=""
                        class="react-icon"
                      />
                    </button>
                    <button class="icon-btn" aria-label="More">
                      <img
                        src="/images/dots-horizontal.svg"
                        alt=""
                        class="react-icon"
                      />
                    </button>
                  </div>
                </div>
              </div>
              <img src="${
                post.thumbnailUrl
              }" alt="post-thumbnail" class="post__img" />
            </div>
          </div>
          <hr class="post__divider"
      `
      )
      .join("");
  } else {
    postedPostContainer.innerHTML = `<p class="user__no-post">This user hasn't posted any Post yet.</p>`;
  }
}

async function loadComment() {
  const res = await fetch(`/comment/u/${userId}`);
  const comments = await res.json();
  const CommentsContainer = document.querySelector(".profile-content");

  if (comments && comments.length > 0) {
    CommentsContainer.innerHTML = `
    <p class="user__no-comment">You haven't comment yet!!</p>
    `;
  } else {
    CommentsContainer.innerHTML = `
    <p class="user__no-comment">You haven't comment yet!!</p>
    `;
  }
}

async function loadBio() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  const bioContainer = document.querySelector(".profile-content");

  bioContainer.innerHTML = `
  <p class="user__bio">${user.bio}</p>
  `;
}

async function loadUserMoreInfo() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  const moreInfoContainer = document.querySelector(".user__more-info");

  moreInfoContainer.innerHTML = `
  <img
    src="${user.backgroundImg}"
    alt="<%= user.profilePicture %>-bgm"
    class="user__bg-img"
  />
  <div class="more-info__container">
    <div class="more-info__title">
      <div class="more-info__name">${user.username}</div>
      <button class="more-info__share">Share</button>
    </div>
    <div class="more-info__details">
      <div class="more-info__follower">
        <!-- ${user.follow} -->
        <p>2</p>
        <p>Follower</p>
      </div>
      <div class="more-info__content">
        <div class="more-info__items">
          <!-- ${new Date(user.createdAt).toDateString()} -->
          <p>5d</p>
          <p>CoderHome Age</p>
        </div>
        <div class="more-info__items">
          <p>${user.contributors.length}</p>
          <p>Contributors</p>
        </div>
        <div class="more-info__items">
          <p>0*</p>
          <p>Visit</p>
        </div>
        <div class="more-info__items">
          <p>${user.liked.length}</p>
          <p>Likes</p>
        </div>
      </div>
    </div>
  </div>

  `;
}
async function loadUserSocialLink() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  const socialLinksContainer = document.querySelector(".user__social-links");

  socialLinksContainer.innerHTML = `
  <p>Social Link</p>
    <div class="social-links__items">
      <a href="#">Instagram</a>
      <a href="#">Facebook</a>
    </div>
    <button class="add-social-link-button">Add</button>

  `;
}

//
loadUserInfo();
loadPostedPost();
loadUserMoreInfo();
loadUserSocialLink();

// Event

const tabs = document.querySelectorAll(".profile-nav__items");
const contents = document.querySelectorAll(".profile-content");

// Khi bấm vào mỗi tab

tabs.forEach((tab) => {
  tab.addEventListener("click", async function (e) {
    e.preventDefault();

    tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    const type = this.dataset.tab;

    if (type === "posts") loadPostedPost();
    else if (type === "comments") loadComment();
    else if (type === "bio") loadBio();
  });
});
