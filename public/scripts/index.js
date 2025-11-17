const coderHome = document.querySelector(".coderhome");
const devTo = document.querySelector(".devto");
const scrollBtn = document.getElementById("scrollTopBtn");

// Function dung de load Post cua Coderhome (duoc luu trong Database)
async function loadCoderhomePost() {
  coderHome.style.cssText = `
    border-bottom: 2px solid #f2f2f2;
    font-weight: bold;
  `;

  devTo.style.cssText = `
    border-bottom: 0;
    font-weight: normal;
  `;

  // Goi API lay tat ca bai viet
  const res = await fetch("/posts/");
  const posts = await res.json();

  const container = document.querySelector(".post");
  container.innerHTML = posts
    .map(
      (p, index) =>
        ` <article class="post__card">
        <div class="post__author">
            <img src="${p.author.profilePicture
        }" alt="author" class="post__author-img"/>
                <a href="/profile/${p.author._id}" class="post__author-name">${p.author?.username || "Unknown"
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
                        <span style="display: flex; align-items: center; gap: 0.5rem" ><img src="/images/show-post-img/Heart.svg" class="react-icon-meta heart"/> 5.5K</span>
                        <span style="display: flex; align-items: center; gap: 0.5rem"><img src="/images/show-post-img/Comment.svg" class="react-icon-meta" style="display: inline;"/> 170</span>
                    </div>
                    <div class="post__interact-action">
                        <button class="icon-btn"><img src="/images/icons/remove-icon.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/icons/bookmark-icon.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
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
    document.querySelectorAll(".heart").forEach(item => {
      item.addEventListener("click", () => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        }
        else item.classList.add("active");
      });
    })
}
loadCoderhomePost(); // Goi lan dau khi truy cap trang index.html


// Function dung de load Post duoc lay tu API cua Dev.to
async function loadDevToPost(req, res) {
  devTo.style.cssText = `
    border-bottom: 2px solid #f2f2f2;
    font-weight: bold;
  `;

  coderHome.style.cssText = `
    border-bottom: 0;
    font-weight: normal;
  `;

  try {
    // Lay 100 post moi nhat tu Dev.to
    const res = await fetch("https://dev.to/api/articles?per_page=100");
    const posts = await res.json();

    const container = document.querySelector(".post");

    container.innerHTML = posts
      .map(
        (p, index) =>
          ` <article class="post__card">
              <div class="post__author">
                  <img src="${p.user.profile_image}" alt="author" class="post__author-img"/>
                  <a href="https://dev.to/${p.user.username}" target="_blank" class="post__author-name">
                    ${p.user.name || p.user.username}
                  </a>
              </div>

              <div class="post__left">
                <div class="post__left-text">
                  <div class="post__content">
                      <a href="${p.url}" target="_blank" class="post__content-title">${p.title}</a>
                      <p class="post__content-overview">${p.description || ""}</p>
                  </div>
                  <div class="post__interact">
                      <div class="post__interact-meta">
                          <span class="created_date">${new Date(p.published_at).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          })}</span>
                          <span><img src="/images/show-post-img/Heart.svg" class="react-icon-meta" style="display: inline;"/> ${p.public_reactions_count}</span>
                          <span><img src="/images/show-post-img/Comment.svg" class="react-icon-meta" style="display: inline;"/> ${p.comments_count}</span>
                      </div>
                      <div class="post__interact-action">
                          <button class="icon-btn"><img src="/images/icons/remove-icon.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/icons/bookmark-icon.svg" class="react-icon"/></button>
                        <button class="icon-btn"><img src="/images/icons/three-dots-icon.svg" class="react-icon"/></button>
                      </div>
                  </div>
                </div>

                <img src="${p.cover_image || "/images/samples/default-thumbnail.png"}" class="post__img"/>
              </div>

              ${index !== posts.length - 1 ? '<hr class="divider">' : ""}
            </article>
          `
      )
      .join("");
  } catch (err) {
    console.error("Error fetching Dev.to posts:", err);
  }
}

// Them su kien khi nguoi dung click lua chon
coderHome.addEventListener("click", loadCoderhomePost);
devTo.addEventListener("click", loadDevToPost);


window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});