import { getRandomLikeCount, handleLikeClick, handleBookmarkClick } from '/scripts/helpers.js';

const renderPostCard = (post, allowRemove=1) => {
  return `
    <article class="post__card">
      <div class="post__author">
        <img src="${post.author.profilePicture}" alt="author" class="post__author-img"/>
        <a href="/profile/${post.author._id}" class="post__author-name">${post.author?.username || "Unknown"}</a>
      </div>
      <div class="post__left">
        <div class="post__left-text">
          <div class="post__content">
            <a href="/post/${post._id}" class="post__content-title">${post.title}</a>
            <p class="post__content-overview">${post.description}</p>
          </div>
          <div class="post__interact">
            <div class="post__interact-meta">
              <span class="created_date">${new Date(post.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })}</span>
              <div class="like-count" style="display: flex; align-items: center; gap: 0.5rem">
                <img src="/images/icons/heart-outline-icon.svg" class="react-icon-meta heart"/>
                <span>${getRandomLikeCount()}</span>
              </div>
              <span style="display: flex; align-items: center; gap: 0.5rem">
              <img src="/images/icons/comment-icon.svg" class="react-icon-meta" style="display: inline;"/> 170
              </span>
            </div>
            <div class="post__interact-action">
              ${allowRemove ? `<button class="icon-btn remove-post"><img src="/images/icons/remove-icon.svg" class="react-icon"/></button>` : ``}
              <button class="icon-btn bookmark-btn"><img src="/images/icons/bookmark-outline-icon.svg" class="react-icon"/></button>
              <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
            </div>
          </div>
        </div>
        <img src="${post.thumbnailUrl}" class="post__img"/>
      </div>
    </article>
    `
}

export { renderPostCard };