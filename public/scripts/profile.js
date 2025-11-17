const userId = location.pathname.split("/").pop();


async function loadWriteStoryButton() {
  const res = await fetch(`/current/`);
  const currentUser = await res.json();
  const res2 = await fetch(`/profiles/${userId}`);
  const user = await res2.json();
  const btnContainer = document.querySelector(".button-container");

  if (user._id == currentUser._id) {
    btnContainer.innerHTML = `
        <a href="/write" class="tell-story-button">
          <img src="" alt="" /> Tell us your story
        </a>
    `;
  } else {
    btnContainer.classList.add("hidden");
  }
}
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
  if (user.postedPosts && user.postedPosts.length > 0) {
    postedPostContainer.innerHTML = user.postedPosts
      .map(
        (post) =>
          ` 
        <hr class="divider">
        <article class="post__card">
        <div class="post__author">
            <img src="${post.author.profilePicture
          }" alt="author" class="post__author-img"/>
                <a href="/profile/${post.author._id
          }" class="post__author-name">${post.author?.username || "Unknown"
          }</a>
        </div>
        <div class="post__left">
            <div class="post__left-text">
                <div class="post__content">
                    <a href="/post/${post._id}" class="post__content-title">${post.title
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
                        <button class="icon-btn"><img src="/images/icons/restrict-icon.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/icons/bookmark-icon.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
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
    postedPostContainer.innerHTML = `
    <hr class="divider">
    <p class="user__no-po-cm-bio">This user hasn't posted any Post yet.</p>
    `;
  }
}

async function loadComment() {
  const res = await fetch(`/comments/u/${userId}`);
  const comments = await res.json();
  const commentsContainer = document.querySelector(".profile-content");
  console.log("Loaded comments:", comments);

  if (comments && comments.length > 0) {
    commentsContainer.innerHTML = comments
      .map(
        (comment) => `
        <hr class="divider"/>
    <div class="comment__container">
      <div class="comment__header">
          <a href="/post/${comment.post?._id || "#"}" class="post__title">${comment.post?.title || "Post not found!"
          }</a>
          <p class="post__date">${new Date(
            comment.createdAt
          ).toDateString()}</p>
      </div>
      <p class="comment__content">${comment.content}</p>
    </div>
    `
      )
      .join("");
  } else {
    commentsContainer.innerHTML = `
    <hr class="divider">
    <p class="user__no-po-cm-bio">No comment yet!!</p>
    `;
  }
}

async function loadBio() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  const res2 = await fetch(`/current/`);
  const currentUser = await res2.json();
  const bioContainer = document.querySelector(".profile-content");

  if (user._id == currentUser._id) {
    if (user.bio && user.bio.trim() !== "") {
      bioContainer.innerHTML = `
      <hr class="divider">
  <p class="user__bio">${user.bio}</p>
  `;
    } else {
      bioContainer.innerHTML = `
  <hr class="divider">
  <p class="user__no-po-cm-bio">User has no bio yet!!</p>
  <button class="add-bio">Add Bio</button>
  `;
    }
  } else {
    if (user.bio && user.bio.trim() !== "") {
      bioContainer.innerHTML = `
      <hr class="divider">
  <p class="user__bio">${user.bio}</p>
  `;
    } else {
      bioContainer.innerHTML = `
    <hr class="divider">
  <p class="user__no-po-cm-bio">User has no bio yet!!</p>
  `;
    }
  }
}

async function loadUserMoreInfo() {
  const res = await fetch(`/profiles/${userId}`);
  const res2 = await fetch(`/comments/u/${userId}`);
  const comments = await res2.json();
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
      <button class="more-info__share" style="display: flex; gap: 0.5rem; align-items: center"><img style="width: 25px; 
      filter: invert(1) brightness(2);" src="/images/share.svg"/>Share</button>
    </div>
    <div class="more-info__details">
      <div class="more-info__follower">
        <!-- ${user.followers?.length || "0"} -->
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
          <p>${user.followingAuthors?.length || "0"}</p>
          <p>Following</p>
        </div>
        <div class="more-info__items">
          <p>${comments.length}</p>
          <p>Comments</p>
        </div>
        <div class="more-info__items">
          <p>${user.likedPost?.length || "0"}</p>
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
      <a href="#" style="display: flex; align-items: center; gap: 0.5rem;"><img style="width: 20px" src="/images/icons/instagram-icon.svg"/>Instagram</a>
      <a href="#" style="display: flex; align-items: center; gap: 0.5rem;"><img style="width: 20px" src="/images/icons/facebook-icon.svg"/>Facebook</a>
    </div>
    <button class="add-social-link-button" style="display: flex; align-items: center; gap: 0.5rem"><img style="width: 25px; 
    filter: invert(1) brightness(2);" src="/images/plus.svg"/>Add</button>

  `;
}
async function loadUserSetting() {
  const res = await fetch(`/current/`);
  const currentUser = await res.json();
  const res2 = await fetch(`/profiles/${userId}`);
  const user = await res2.json();
  const settingContainer = document.querySelector(".user__settings");

  if (user._id == currentUser._id) {
    settingContainer.innerHTML = `
      <div class="setting__content">
        <div>
          <p class="setting__title">Profile</p>
          <p class="setting__description">Customize your Profile</p>
        </div>
        <button class="setting__update-btn edit-profile">Update</button>
      </div>
      <div class="setting__content">
        <div>
          <p class="setting__title">Privacy</p>
          <p class="setting__description">
            Manage who can view your Profile
          </p>
        </div>
        <button class="setting__update-btn">Update</button>
      </div>
      <div class="setting__content">
        <div>
          <p class="setting__title">Avatar</p>
          <p class="setting__description">Change your Avatar</p>
        </div>
        <button class="setting__update-btn">Update</button>
      </div>
    `;
  } else {
    settingContainer.classList.add("hidden");
  }


  // Them chuc nang edit profile
  const editProfileForm = document.querySelector(".edit-profile__form");
  const cancelBtn = document.querySelector(".cancel-btn");
  const submitBtn = document.querySelector(".submit-btn");
  const overlay = document.querySelector(".overlay");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const bio = document.getElementById("bio");



  const settingUpdateBtnProfile = document.querySelector(".edit-profile");

  cancelBtn.addEventListener("click", () => {
    editProfileForm.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    editProfileForm.classList.remove("active");
    overlay.classList.remove("active");
  });

  settingUpdateBtnProfile.addEventListener("click", function () {
    editProfileForm.classList.add("active");
    overlay.classList.add("active");
    username.placeholder = currentUser.username;
    email.placeholder = currentUser.email;
    bio.textContent = currentUser.bio;
  });

  submitBtn.addEventListener("click", async () => {
    const usernameContent = (!username.textContent.length) ? username.placeholder : username.textContent;
    const emailContent = (!email.textContent.length) ? email.placeholder : email.textContent;
    const bioContent = (!bio.textContent.length) ? bio.placeholder : bio.textContent;

    await fetch(`/profiles/${currentUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: usernameContent,
        email: emailContent,
        bio: bioContent
      })
    });
    window.location.reload();
  })
}
//
loadWriteStoryButton();
loadUserInfo();
loadPostedPost();
loadUserMoreInfo();
loadUserSetting();
loadUserSocialLink();

// Responsive
const sideProfile = document.querySelector(".side-profile");
const nav = document.querySelector(".profile-nav");
const userMain = document.querySelector(".user__main");
const mq = window.matchMedia("(max-width: 900px)");
const bgImg = document.querySelector(".user__bg-img");
const moreInfoContainer = document.querySelector(".more-info__container");
const userAvt = document.querySelector(".user__avatar");

function responsive(e) {
  if (e.matches) {
    nav.before(sideProfile);
  } else {
    userMain.after(sideProfile);
  }
}

mq.addEventListener("change", responsive);
responsive(mq);

const tabs = document.querySelectorAll(".profile-nav__items");
const contents = document.querySelector(".profile-content");

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

//Khi bam vao More
const more = document.querySelector(".side-profile__more");
const socialLinksContainer = document.querySelector(".user__social-links");
const moreInfo = document.querySelector(".user__more-info");
const arrow = document.querySelector(".arrow");
more.addEventListener("click", () => {
  sideProfile.classList.toggle("active");
  arrow.classList.toggle("active");
});
