import { handleLikeClick, handleCommentClick, handleBookmarkClick } from '/scripts/utils/postHandler.js';
import { renderPostCard } from '/scripts/components/post-card.js';

const userId = location.pathname.split("/").pop();

async function loadWriteStoryButton() {
  const currentUser = await fetch('/current/')
    .then(c => c.json());
  const user = await fetch(`/profiles/${userId}`)
    .then(u => u.json());
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
  const user = await fetch(`/profiles/${userId}`)
    .then(u => u.json());
  document.title = `${user.username}'s Profile`;
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
  const user = await fetch(`/profiles/${userId}`)
    .then(u => u.json());
  const postedPostContainer = document.querySelector(".profile-content");

  const posts = Array.isArray(user.postedPosts) ? user.postedPosts.slice() : [];

  if (posts.length > 0) {
    // Sort newest first by createdAt (fallback to _id timestamp if createdAt missing)
    posts.sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : (a?._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : (b?._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
      return bTime - aTime;
    });

    postedPostContainer.innerHTML = posts
      .map(p => renderPostCard(p, 1, 0)).join('');

  } else {
    postedPostContainer.innerHTML = `
    <p class="user__no-po-cm-bio">This user hasn't posted any posts yet.</p>
    `;
  }
}

async function loadComment() {
  const comments = await fetch(`/comments/u/${userId}`)
    .then(c => c.json());
  const commentsContainer = document.querySelector(".profile-content");

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
  const user = await fetch(`/profiles/${userId}`)
    .then(u => u.json());
  // const currentUser = await fetch('/current/')
  //   .then(c => c.json());

  const bioContainer = document.querySelector(".profile-content");

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

async function loadUserMoreInfo() {
  const user = await fetch(`/profiles/${userId}`)
    .then(u => u.json());
  const comments = await fetch(`/comments/u/${userId}`)
    .then(c => c.json());
  const moreInfoContainer = document.querySelector(".user__more-info");

  moreInfoContainer.innerHTML = `
  <img
    src="${user.backgroundImg}"
    alt="User background"
    class="user__bg-img"
  />
  <div class="more-info__container">
    <div class="more-info__title">
      <div class="more-info__name">${user.username}</div>
      <button class="more-info__share">
        <img src="/images/icons/classic-share-icon.svg"/>
        <span>Share</span>
      </button>
    </div>
    <div class="more-info__details">
      <div class="more-info__follower">
        <p>2</p>
        <p>Followers</p>
      </div>
      <div class="more-info__content">
        <div class="more-info__items">
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
  const user = await fetch(`/profiles/${userId}`)
    .then(u => u.json());
  const currentUser = await fetch('/current/')
    .then(c => c.json());
  const socialLinksContainer = document.querySelector(".user__social-links");

  socialLinksContainer.innerHTML = `
  <p>Social Link</p>
    <div class="social-links__items">
      <a href="#" style="display: flex; align-items: center; gap: 0.5rem;"><img style="width: 20px" src="/images/icons/instagram.svg"/>Instagram</a>
      <a href="#" style="display: flex; align-items: center; gap: 0.5rem;"><img style="width: 20px" src="/images/icons/facebook-icon.svg"/>Facebook</a>
    </div>
    ${user._id !== currentUser._id ? `<button class="add-social-link-button" style="display: flex; align-items: center; gap: 0.5rem">Add</button>` : ''}
  `;
}
async function loadUserSetting() {
  const currentUser = await fetch(`/current/`)
    .then(c => c.json());
  const user = await fetch(`/profiles/${userId}`)
    .then(u => u.json());
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


  // Profile editor
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
    bio.value = currentUser.bio;
  });

  submitBtn.addEventListener("click", async () => {
    const usernameContent = username.value.trim() || username.placeholder;
    const emailContent = email.value.trim() || email.placeholder;
    const bioContent = bio.value.trim() || bio.value;

    console.log('Current User ID:', currentUser._id);
    console.log('Data to send:', {
      username: usernameContent,
      email: emailContent,
      bio: bioContent
    });

    await fetch(`/profiles/${currentUser._id}`, {
      method: "PATCH",
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
  });
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
const arrow = document.querySelector(".arrow");
more.addEventListener("click", () => {
  sideProfile.classList.toggle("active");
  arrow.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
  const postContainer = document.querySelector(".profile-content");
  // Setup event delegation
  handleLikeClick(postContainer);
  handleBookmarkClick(postContainer);
  handleCommentClick(postContainer);
});
