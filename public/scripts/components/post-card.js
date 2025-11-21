import { getRandomLikeCount, handleLikeClick, handleBookmarkClick } from '/scripts/helpers.js';

const renderPostCard = (post, ownSrc = 1, showRemoveBtn = 1) => {
  // ownSrc = 1: Posts' source is from DB
  // ownSrc = 0: Posts' source is from dev.to

  return `
    <article class="post__card">
      <div class="post__author">
        <img src="${ownSrc ? post.author.profilePicture : post.user.profile_image}" alt="author" class="post__author-img"/>
        <a href="${ownSrc
      ? ('/profile/' + post.author._id)
      : ('https://dev.to/' + post.user.username)}" 
          class="post__author-name"
        >
          ${ownSrc
      ? (post.author?.username || "Unknown")
      : (post.user.name || post.user.username)
    }</a>
      </div>
      <div class="post__left">
        <div class="post__left-text">
          <div class="post__content">
            <a href="${ownSrc ? '/post/' + post._id : post.url}" class="post__content-title">${post.title}</a>
            <p class="post__content-overview">${post.description}</p>
          </div>
          <div class="post__interact">
            <div class="post__interact-meta">
              <span class="created_date">${ownSrc ? new Date(post.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }) : new Date(post.published_at).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    })}</span>
              <div class="like-count" style="display: flex; align-items: center; gap: 0.5rem">
                <img src="/images/icons/heart-outline-icon.svg" class="react-icon-meta heart"/>
                <span>${ownSrc ? getRandomLikeCount() : post.public_reactions_count}</span>
              </div>
              <span style="display: flex; align-items: center; gap: 0.5rem">
              <img src="/images/icons/comment-icon.svg" class="react-icon-meta" style="display: inline;"/> ${ownSrc ? '170' : post.comments_count}
              </span>
            </div>
            <div class="post__interact-action">
              ${showRemoveBtn ? `<button class="icon-btn remove-post"><img src="/images/icons/remove-icon.svg" class="react-icon"/></button>` : ``}
              <button class="icon-btn bookmark-btn"><img src="/images/icons/bookmark-outline-icon.svg" class="react-icon"/></button>
              <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
            </div>
          </div>
        </div>
        <img src="${ownSrc ? post.thumbnailUrl : (post.cover_image || "/images/samples/default-thumbnail.png")}" class="post__img"/>
      </div>
    </article>
    `
}

export { renderPostCard };