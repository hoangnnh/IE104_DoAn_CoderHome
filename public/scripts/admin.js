const dashboardBtn = document.querySelector(".dashboard");
const manageUsersBtn = document.querySelector(".manage-users");
const managePostsBtn = document.querySelector(".manage-posts");
const dashboardIcon = document.querySelector(".dashboard-icon");
const managePostsIcon = document.querySelector(".manage-posts-icon");
const manageUsersIcon = document.querySelector(".manage-users-icon");

const mainContent = document.querySelector(".main__content");


async function loadManageUsers() {
    const res = await fetch("/profiles/");
    const users = await res.json();
    mainContent.innerHTML = "";
    mainContent.innerHTML = `
    <div class="main__header">
                <p class="main__header-title">Manage Users</p>
                <button class="main__header-button">Add Users</button>
            </div>
            <div class="main__list">
                <div class="main__list-header">
                    <p class="list-title">User List</p>
                    <div class="search">
                        <img src="/images/magnify.svg" alt="magnify icon" class="search-img">
                        <p>Search User</p>
                    </div>
                </div>
                <div class="main__list-content">
                    <div class="table__row">
                        <div class="table__row-header">No</div>
                        <div class="table__row-header">Profile</div>
                        <div class="table__row-header">Email</div>
                        <div class="table__row-header">Role</div>
                        <div class="table__row-header">Action</div>
                    </div>
                </div>
            </div>
    `;
    const mainListContent = document.querySelector(".main__list-content");
    const firstTableRow = mainListContent.innerHTML;
    const content = users.map((u, index) => `
                    <div class="table__row">
                        <div class="table__cell">${index + 1}</div>
                        <div class="table__cell">${u.username}</div>
                        <div class="table__cell">${u.email}</div>
                        <div class="table__cell">${u.role}</div>
                        <div class="table__cell action">
                            <button class="edit-btn">
                                <img src="/images/square-edit-outline.svg" alt="edit icon">
                                <p>Edit</p>
                            </button>
                            <button class="delete-btn">
                                <img src="/images/trash-can-outline.svg" alt="delete icon">
                                <p>Delete</p>
                            </button>
                        </div>
                    </div>
    `).join("");
    mainListContent.innerHTML = firstTableRow + content;
}

async function loadManagePosts() {
    const res = await fetch("/posts/");
    const posts = await res.json();
    mainContent.innerHTML = "";
    mainContent.innerHTML = `
    <div class="main__header">
                <p class="main__header-title">Manage Posts</p>
                <button class="main__header-button">Add Post</button>
            </div>
            <div class="main__list">
                <div class="main__list-header">
                    <p class="list-title">Post List</p>
                    <div class="search">
                        <img src="/images/magnify.svg" alt="magnify icon" class="search-img">
                        <p>Search Post</p>
                    </div>
                </div>
                <div class="main__list-content">
                    <div class="table__row">
                        <div class="table__row-header">No</div>
                        <div class="table__row-header">Title</div>
                        <div class="table__row-header">Author</div>
                        <div class="table__row-header">Published Date</div>
                        <div class="table__row-header">Action</div>
                    </div>
                </div>
            </div>
    `;
    const mainListContent = document.querySelector(".main__list-content");
    const firstTableRow = mainListContent.innerHTML;
    const content = posts.map((p, index) => `
                    <div class="table__row">
                        <div class="table__cell">${index + 1}</div>
                        <div class="table__cell title">${p.title}</div>
                        <div class="table__cell">${p.author.username}</div>
                        <div class="table__cell">${new Date(p.createdAt).toLocaleDateString()}</div>
                        <div class="table__cell action">
                            <button class="edit-btn">
                                <img src="/images/square-edit-outline.svg" alt="edit icon">
                                <p>Edit</p>
                            </button>
                            <button class="delete-btn">
                                <img src="/images/trash-can-outline.svg" alt="delete icon">
                                <p>Delete</p>
                            </button>
                        </div>
                    </div>
    `).join("");

    mainListContent.innerHTML = firstTableRow + content;
}

managePostsBtn.addEventListener("click", loadManagePosts);
manageUsersBtn.addEventListener("click", loadManageUsers);
// dashboardBtn.addEventListener("click", loadDashboard);

managePostsBtn.addEventListener("mouseenter", () => {
    managePostsIcon.classList.add("hover-img");
});
managePostsBtn.addEventListener("mouseleave", () => {
    managePostsIcon.classList.remove("hover-img");
});

manageUsersBtn.addEventListener("mouseenter", () => {
    manageUsersIcon.classList.add("hover-img");
});
manageUsersBtn.addEventListener("mouseleave", () => {
    manageUsersIcon.classList.remove("hover-img");
});

dashboardBtn.addEventListener("mouseenter", () => {
    dashboardIcon.classList.add("hover-img");
});
dashboardBtn.addEventListener("mouseleave", () => {
    dashboardIcon.classList.remove("hover-img");
});
