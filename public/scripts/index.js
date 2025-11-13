async function loadPost() {
  const res = await fetch("/posts/");
  const posts = await res.json();

  const container = document.querySelector(".post");
  container.innerHTML = posts
    .map(
      (p, index) =>
        ` <article class="post__card">
        <div class="post__author">
            <img src="${
              p.author.profilePicture
            }" alt="author" class="post__author-img"/>
                <a href="/profile/${p.author._id}" class="post__author-name">${
          p.author?.username || "Unknown"
        }</a>
        </div>
        <div class="post__left">
            <div class="post__left-text">
                <div class="post__content">
                    <a href="/post/${p._id}" class="post__content-title">${p.title}</a>
                    <p class="post__content-overview">${p.description}</p>
                </div>
                <div class="post__interact">
                    <div class="post__interact-meta">
                        <span class="created_date">${new Date(
                          p.createdAt
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        })}</span>
                        <span><img src="/images/show-post-img/Heart.svg" class="react-icon-meta" style="display: inline;"/> 5.5K</span>
                        <span><img src="/images/show-post-img/Comment.svg" class="react-icon-meta" style="display: inline;"/> 170</span>
                    </div>
                    <div class="post__interact-action">
                        <button class="icon-btn"><img src="/images/minus-circle-outline.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/bookmark-outline.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/dots-horizontal.svg" class="react-icon"/></button>
                    </div>
                </div>
            </div>
            <img src="${p.thumbnailUrl}" class="post__img"/>
        </div>
        ${index !== posts.length - 1 ? '<hr class="divider">' : ""}
        </article>
    `
    )
    .join("");
}
loadPost();
