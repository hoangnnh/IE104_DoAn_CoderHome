import { getRandomLikeCount, handleLikeClick, handleBookmarkClick } from '/scripts/helpers.js';

// Lấy userId từ URL
const userId = location.pathname.split("/").pop();

// Load nút "Tell us your story" nếu là chính chủ
async function loadWriteStoryButton() {
  const res = await fetch(`/current/`);
  const currentUser = await res.json();
  const res2 = await fetch(`/profiles/${userId}`);
  const user = await res2.json();
  const btnContainer = document.querySelector(".button-container");

  if (user._id == currentUser._id) {
    // Hiển thị nút viết bài nếu là chính chủ
    btnContainer.innerHTML = `
        <a href="/write" class="tell-story-button">
          <img src="" alt="" /> Tell us your story
        </a>
    `;
  } else {
    // Ẩn container nếu không phải chính chủ
    btnContainer.classList.add("hidden");
  }
}

// Load thông tin cơ bản của user
async function loadUserInfo() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  document.title = user.username;
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

// Load các bài viết đã đăng của user
async function loadPostedPost() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  const postedPostContainer = document.querySelector(".profile-content");

  const posts = Array.isArray(user.postedPosts) ? user.postedPosts.slice() : [];

  if (posts.length > 0) {
    // Sắp xếp bài viết mới nhất lên đầu
    posts.sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : (a?._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : (b?._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
      return bTime - aTime;
    });

    // Render danh sách bài viết
    postedPostContainer.innerHTML = posts
      .map((post) => {
        const author = post.author || {};
        const authorAvatar = author.profilePicture || '/images/samples/default-avt.png';
        const authorName = author.username || 'Unknown';
        const authorId = author._id || (author.id ? author.id : '#');

        const createdDate = post.createdAt ? new Date(post.createdAt) : null;
        const formattedDate = createdDate
          ? createdDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
          : '';

        return ` 
        <hr class="divider">
        <article class="post__card">
          <div class="post__author">
            <img src="${authorAvatar}" alt="author" class="post__author-img"/>
            <a href="/profile/${authorId}" class="post__author-name">${authorName}</a>
          </div>
          <div class="post__left">
            <div class="post__left-text">
              <div class="post__content">
                <a href="/post/${post._id}" class="post__content-title">${post.title}</a>
                <p class="post__content-overview">${post.description || ''}</p>
              </div>
              <div class="post__interact">
                <div class="post__interact-meta">
                  <span class="created_date">${formattedDate}</span>
                  <div class="like-count" style="display: flex; align-items: center; gap: 0.5rem">
                    <img src="/images/icons/heart-outline-icon.svg" class="react-icon-meta heart"/>
                    <span>${getRandomLikeCount()}</span>
                   </div>
                   <span style="display: flex; align-items: center; gap: 0.5rem">
                   <img src="/images/icons/comment-icon.svg" class="react-icon-meta" style="display: inline;"/>170</span>
                </div>
                <div class="post__interact-action">
                  <button class="icon-btn bookmark-btn"><img src="/images/icons/bookmark-outline-icon.svg" class="react-icon"/></button>
                  <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
                </div>
              </div>
            </div>
            <img src="${post.thumbnailUrl || '/images/samples/default-thumbnail.png'}" class="post__img"/>
          </div>
        </article>
      `;
      })
      .join('');

    handleLikeClick(); // Kích hoạt chức năng like
    handleBookmarkClick(); // Kích hoạt chức năng bookmark

  } else {
    // Hiển thị thông báo nếu chưa có bài viết
    postedPostContainer.innerHTML = `
    <p class="user__no-po-cm-bio">This user hasn't posted any posts yet.</p>
    `;
  }
}

// Load comment của user
async function loadComment() {
  const res = await fetch(`/comments/u/${userId}`);
  const comments = await res.json();
  const commentsContainer = document.querySelector(".profile-content");
  console.log("Loaded comments:", comments);

  if (comments && comments.length > 0) {
    // Render danh sách comment
    commentsContainer.innerHTML = comments
      .map(
        (comment) => `
        <hr class="divider"/>
    <div class="comment__container">
      <div class="comment__header">
          <a href="/post/${comment.post?._id || "#"}" class="post__title">${comment.post?.title || "Post not found!"}</a>
          <p class="post__date">${new Date(
            comment.createdAt
          ).toDateString()}</p>
      </div>
      <p class="comment__content">${comment.content}</p>
    </div>
    `
      )
      .join('');
  } else {
    // Thông báo nếu chưa có comment
    commentsContainer.innerHTML = `
    <hr class="divider">
    <p class="user__no-po-cm-bio">No comment yet!!</p>
    `;
  }
}

// Load bio của user
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

// Load thông tin chi tiết hơn của user
async function loadUserMoreInfo() {
  const res = await fetch(`/profiles/${userId}`);
  const res2 = await fetch(`/comments/u/${userId}`);
  const comments = await res2.json();
  const user = await res.json();
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
      <button class="more-info__share"><img src="/images/icons/classic-share-icon.svg"/>Share</button>
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

// Load social link của user
async function loadUserSocialLink() {
  const res = await fetch(`/profiles/${userId}`);
  const user = await res.json();
  const socialLinksContainer = document.querySelector(".user__social-links");

  socialLinksContainer.innerHTML = `
  <p>Social Link</p>
    <div class="social-links__items">
      <a href="#" style="display: flex; align-items: center; gap: 0.5rem;"><img style="width: 20px" src="/images/icons/instagram.svg"/>Instagram</a>
      <a href="#" style="display: flex; align-items: center; gap: 0.5rem;"><img style="width: 20px" src="/images/icons/facebook-icon.svg"/>Facebook</a>
    </div>
    <button class="add-social-link-button" style="display: flex; align-items: center; gap: 0.5rem"><img style="width: 25px; 
    filter: invert(1) brightness(2);" src="/images/icons/plus-icon.svg"/>Add</button>

  `;
}

// Load cài đặt user
async function loadUserSetting() {
  const res = await fetch(`/current/`);
  const currentUser = await res.json();
  const res2 = await fetch(`/profiles/${userId}`);
  const user = await res2.json();
  const settingContainer = document.querySelector(".user__settings");

  if (user._id == currentUser._id) {
    // Hiển thị cài đặt nếu là chính chủ
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
    // Ẩn cài đặt nếu không phải chính chủ
    settingContainer.classList.add("hidden");
  }

  // Thêm chức năng edit profile
  const editProfileForm = document.querySelector(".edit-profile__form");
  const cancelBtn = document.querySelector(".cancel-btn");
  const submitBtn = document.querySelector(".submit-btn");
  const overlay = document.querySelector(".overlay");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const bio = document.getElementById("bio");
  const settingUpdateBtnProfile = document.querySelector(".edit-profile");

  // Hủy edit
  cancelBtn.addEventListener("click", () => {
    editProfileForm.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    editProfileForm.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Mở form edit
  settingUpdateBtnProfile.addEventListener("click", function () {
    editProfileForm.classList.add("active");
    overlay.classList.add("active");
    username.placeholder = currentUser.username;
    email.placeholder = currentUser.email;
    bio.value = currentUser.bio;
  });

  // Submit form edit
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
    // Reload page sau khi update
    window.location.reload();
  });
}

// Gọi các hàm load ban đầu
loadWriteStoryButton();
loadUserInfo();
loadPostedPost();
loadUserMoreInfo();
loadUserSetting();
loadUserSocialLink();

// Responsive layout
const sideProfile = document.querySelector(".side-profile");
const nav = document.querySelector(".profile-nav");
const userMain = document.querySelector(".user__main");
const mq = window.matchMedia("(max-width: 900px)");
const bgImg = document.querySelector(".user__bg-img");
const moreInfoContainer = document.querySelector(".more-info__container");
const userAvt = document.querySelector(".user__avatar");

// Chuyển vị trí layout theo media query
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

// Click vào các tab
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

// Khi bấm vào More
const more = document.querySelector(".side-profile__more");
const socialLinksContainer = document.querySelector(".user__social-links");
const moreInfo = document.querySelector(".user__more-info");
const arrow = document.querySelector(".arrow");
more.addEventListener("click", () => {
  sideProfile.classList.toggle("active"); // Ẩn/hiện side profile
  arrow.classList.toggle("active"); // Thêm hiệu ứng arrow
});
