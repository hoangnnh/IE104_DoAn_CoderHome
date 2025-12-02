import { renderPostCard } from "/scripts/components/post-card.js";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q") || "";

const tabs = document.querySelectorAll(".nav__items");
const userTab = document.getElementById("tab-users");

// Function to get posts and users that match the keyword
async function fetchSearch(type, keyword) {
    const res = await fetch(
        `/search?type=${type}&q=${encodeURIComponent(keyword)}`
    );
    const data = await res.json();
    return data;
}

// Function to render posts match the keyword
async function loadPosts() {
    const posts = await fetchSearch("posts", query);
    const container = document.querySelector(".main__content");
    container.innerHTML = ``;
    if (!posts.length) {
        container.innerHTML = `<p style="display: flex; justify-content: center; font-size: 2.5rem; font-weight: bold;">No post found!</p>`;
        return;
    }
    const postsHTML = posts.map((p) => renderPostCard(p)).join("");
    container.insertAdjacentHTML("beforeend", postsHTML);
}

// Function to render users match the keyword
async function loadUsers() {
    const users = await fetchSearch("users", query);
    const container = document.querySelector(".main__content");
    container.innerHTML = ``;

    if (!users.length) {
        container.innerHTML = `<p style="display: flex; justify-content: center; font-size: 2.5rem; font-weight: bold;">No user found!</p>`;
        return;
    }
    container.innerHTML = users
        .map(
            (user) =>
                `
            <div class="user__list-item">
                <div class="user__info">
                    <img src="${user.profilePicture}" alt="Blogger's avatar" class="avatar">
                    <div class="content">
                        <a href="/profile/${user._id}" style="font-weight: bold;" class="name">${user.username}</a>
                    <p class="bio">${user.bio}</p>
                </div>
                </div>
                <button class="follow__btn">
                Follow
                </button>
            </div>
            <hr class="divider">
        `
        )
        .join("");
}

// Function to handle tab click
function tabEvent() {
    tabs.forEach((tab) => {
    tab.addEventListener("click", async function (e) {
        e.preventDefault();

        tabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");

        const type = this.dataset.tab;

        if (type === "post") {
            loadPosts();
            userTab.classList.remove("active");
        } else if (type === "user") {
            loadUsers();
            userTab.classList.add("active");
        }
    });
});
}

export {loadPosts, loadUsers, tabEvent}
