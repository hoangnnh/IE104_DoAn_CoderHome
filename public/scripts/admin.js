// =======================
// LẤY CÁC PHẦN TỬ TỪ DOM
// =======================
const dashboardBtn = document.querySelector(".dashboard");
const manageUsersBtn = document.querySelector(".manage-users");
const managePostsBtn = document.querySelector(".manage-posts");
const manageCommentsBtn = document.querySelector(".manage-comments");

const dashboardIcon = document.querySelector(".dashboard-icon");
const managePostsIcon = document.querySelector(".manage-posts-icon");
const manageUsersIcon = document.querySelector(".manage-users-icon");
const manageCommentsIcon = document.querySelector(".manage-comments-icon");

const modalDelete = document.querySelector(".modal__delete");
const editProfileForm = document.querySelector(".edit-profile__form");
const editCommentForm = document.querySelector(".edit-comment__form");
const overlay = document.querySelector(".overlay");

// Nút submit + cancel cho form và modal
const submitBtnDeleteForm = document.querySelector(".submit-btn");
const submitBtnEditProfileForm = document.querySelector(".edit-profile__form .submit-btn");
const submitBtnEditCommentForm = document.querySelector(".edit-comment__form .submit-btn");
const cancelBtnDeleteForm = document.querySelector(".cancel-btn");
const cancelBtnEditProfileForm = document.querySelector(".edit-profile__form .cancel-btn");
const cancelBtnEditCommentForm = document.querySelector(".edit-comment__form .cancel-btn");

const mainContent = document.querySelector(".main__content");



// =======================
// ĐÓNG CÁC FORM / MODAL
// =======================

// Hủy modal xóa
cancelBtnDeleteForm.addEventListener("click", () => {
    modalDelete.classList.remove("active");
    overlay.classList.remove("active");
});

// Hủy form edit user
cancelBtnEditProfileForm.addEventListener("click", () => {
    editProfileForm.classList.remove("active");
    overlay.classList.remove("active");
});

// Click overlay để đóng modal/form
overlay.addEventListener("click", () => {
    modalDelete.classList.remove("active");
    editProfileForm.classList.remove("active");
    overlay.classList.remove("active");
});





// =======================
// LOAD DANH SÁCH USERS
// =======================
async function loadManageUsers() {
    const res = await fetch("/profiles/");
    const users = await res.json();

    // Reset giao diện
    mainContent.innerHTML = "";

    // Render layout phần Manage Users
    mainContent.innerHTML = `
        <div class="main__header">
            <p class="main__header-title">Manage Users</p>
            <button class="main__header-button">Add Users</button>
        </div>
        <div class="main__list">
            <div class="main__list-header">
                <p class="list-title">User List</p>
                <label class="search">
                    <img src="/images/icons/admin/magnify.svg" class="search-img">
                    <input placeholder="Search User"></input>
                </label>
            </div>
            <div class="main__list-content">
                <div class="table__row-user">
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

    // Lưu lại header table
    const firstTableRow = mainListContent.innerHTML;

    // Render từng user
    const content = users.map((u, index) => `
        <div class="table__row-user">
            <div class="table__cell">${index + 1}</div>
            <div class="table__cell cell-username">${u.username}</div>
            <div class="table__cell cell-email">${u.email}</div>
            <div class="table__cell cell-role">${u.role}</div>
            <div class="table__cell action">
                <button class="edit-btn">
                    <img src="/images/icons/admin/square-edit-outline.svg">
                    <p>Edit</p>
                </button>
                <button class="delete-btn">
                    <img src="/images/icons/admin/trash-can-outline.svg">
                    <p>Delete</p>
                </button>
            </div>
        </div>
    `).join("");

    mainListContent.innerHTML = firstTableRow + content;


    // ==========================
    // XỬ LÝ NÚT DELETE USER
    // ==========================
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            modalDelete.classList.add("active");
            overlay.classList.add("active");

            const row = this.closest(".table__row-user");

            submitBtnDeleteForm.addEventListener("click", function () {
                row.style.display = "none";
                modalDelete.classList.remove("active");
                overlay.classList.remove("active");
            });
        })
    });


    // ==========================
    // XỬ LÝ NÚT EDIT USER
    // ==========================
    let currentRow = null;

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            editProfileForm.classList.add("active");
            overlay.classList.add("active");
            currentRow = this.closest(".table__row-user");
        });
    });

    // Submit edit
    submitBtnEditProfileForm.addEventListener("click", function () {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const role = document.getElementById("role").value;

        if (currentRow) {
            currentRow.querySelector(".cell-username").textContent = username;
            currentRow.querySelector(".cell-email").textContent = email;
            currentRow.querySelector(".cell-role").textContent = role;
        }

        editProfileForm.classList.remove("active");
        overlay.classList.remove("active");
    });
}





// =======================
// LOAD DANH SÁCH POSTS
// =======================
async function loadManagePosts() {
    const res = await fetch("/posts/");
    const posts = await res.json();

    mainContent.innerHTML = `
        <div class="main__header">
            <p class="main__header-title">Manage Posts</p>
            <a href="/write" class="main__header-button" style="text-decoration: none">Add Post</a>
        </div>
        <div class="main__list">
            <div class="main__list-header">
                <p class="list-title">Post List</p>
                <label class="search">
                    <img src="/images/icons/admin/magnify.svg" class="search-img">
                    <input placeholder="Search Post"></input>
                </label>
            </div>
            <div class="main__list-content">
                <div class="table__row">
                    <div class="table__row-header">No</div>
                    <div class="table__row-header">Title</div>
                    <div class="table__row-header">Author</div>
                    <div class="table__row-header">Published Date</div>
                    <div class="table__row-header">Status</div>
                    <div class="table__row-header">Action</div>
                </div>
            </div>
        </div>
    `;

    const mainListContent = document.querySelector(".main__list-content");
    const firstTableRow = mainListContent.innerHTML;

    // Render mỗi bài viết
    const content = posts.map((p, index) => `
        <div class="table__row">
            <div class="table__cell">${index + 1}</div>
            <div class="table__cell title">${p.title}</div>
            <div class="table__cell">${p.author.username}</div>
            <div class="table__cell">${new Date(p.createdAt).toLocaleDateString()}</div>
            <div class="table__cell status">Pending</div>
            <div class="table__cell action">
                <button class="approve-btn">
                    <img src="/images/icons/admin/check-outline.svg">
                    <p>Approve</p>
                </button>
                <button class="delete-btn">
                    <img src="/images/icons/admin/trash-can-outline.svg">
                    <p>Delete</p>
                </button>
            </div>
        </div>
    `).join("");

    mainListContent.innerHTML = firstTableRow + content;


    // ==========================
    // APPROVE POST
    // ==========================
    document.querySelectorAll(".approve-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const row = this.closest(".table__row");
            const statusCell = row.querySelector(".status");

            statusCell.textContent = "Accepted";
            statusCell.style.color = "green";
            statusCell.style.fontWeight = "600";

            this.style.display = "none";
        });
    });


    // ==========================
    // DELETE POST
    // ==========================
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            modalDelete.classList.add("active");
            overlay.classList.add("active");

            const row = this.closest(".table__row");

            submitBtnDeleteForm.addEventListener("click", function () {
                row.style.display = "none";
                modalDelete.classList.remove("active");
                overlay.classList.remove("active");
            });
        })
    });

}





// =======================
// LOAD DANH SÁCH COMMENTS
// =======================
async function loadManageComments() {
    const res = await fetch("/comments/");
    const comments = await res.json();

    // Layout
    mainContent.innerHTML = `
        <div class="main__header">
            <p class="main__header-title">Manage Comments</p>
            <button class="main__header-button">Add Comments</button>
        </div>
        <div class="main__list">
            <div class="main__list-header">
                <p class="list-title">Comment List</p>
                <label class="search">
                    <img src="/images/icons/admin/magnify.svg" class="search-img">
                    <input placeholder="Search Comment"></input>
                </label>
            </div>
            <div class="main__list-content">
                <div class="table__row-comment">
                    <div class="table__row-header">No</div>
                    <div class="table__row-header">Post</div>
                    <div class="table__row-header">Content</div>
                    <div class="table__row-header">Author</div>
                    <div class="table__row-header">Action</div>
                </div>
            </div>
        </div>
    `;

    const mainListContent = document.querySelector(".main__list-content");
    const firstTableRow = mainListContent.innerHTML;

    // Render comment
    const content = comments.map((c, index) => `
        <div class="table__row-comment">
            <div class="table__cell">${index + 1}</div>
            <div class="table__cell title">${c.post.title}</div>
            <div class="table__cell cell-content">${c.content}</div>
            <div class="table__cell">${c.author.username}</div>
            <div class="table__cell action">
                <button class="edit-btn">
                    <img src="/images/icons/admin/square-edit-outline.svg">
                    <p>Edit</p>
                </button>
                <button class="delete-btn">
                    <img src="/images/icons/admin/trash-can-outline.svg">
                    <p>Delete</p>
                </button>
            </div>
        </div>
    `).join("");

    mainListContent.innerHTML = firstTableRow + content;


    // DELETE COMMENT
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            modalDelete.classList.add("active");
            overlay.classList.add("active");

            const row = this.closest(".table__row-comment");

            submitBtnDeleteForm.addEventListener("click", function () {
                row.style.display = "none";
                modalDelete.classList.remove("active");
                overlay.classList.remove("active");
            });
        })
    });


    // EDIT COMMENT
    let currentRow = null;

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            editCommentForm.classList.add("active");
            overlay.classList.add("active");
            currentRow = this.closest(".table__row-comment");
        });
    });

    submitBtnEditCommentForm.addEventListener("click", function () {
        const content = document.getElementById("content").value;

        if (currentRow) {
            currentRow.querySelector(".cell-content").textContent = content;
        }

        editCommentForm.classList.remove("active");
        overlay.classList.remove("active");
    });
}





// ===============================
// LOAD DASHBOARD THỐNG KÊ
// ===============================
async function loadPostStats() {
    // Lấy dữ liệu thống kê
    const resUser = await fetch("/profiles/");
    const users = await resUser.json();
    const resPost = await fetch("/posts/");
    const posts = await resPost.json();
    const resComment = await fetch("/comments/");
    const comments = await resComment.json();

    // Render UI
    mainContent.innerHTML = `
        <div class="card__container">
            <ul class="card__list">
                <li class="card__item">
                    <p>Total Users</p>
                    <div class="card__item-info">
                        <img src="/images/icons/admin/account.svg">
                        <p class="count">${users.length}</p>
                    </div>
                </li>
                <li class="card__item">
                    <p>Total Posts</p>
                    <div class="card__item-info">
                        <img src="/images/icons/admin/text-box-multiple-outline.svg">
                        <p class="count">${posts.length}</p>
                    </div>
                </li>
                <li class="card__item">
                    <p>Total Comments</p>
                    <div class="card__item-info">
                        <img src="/images/icons/admin/comment-regular-full.svg">
                        <p class="count">${comments.length}</p>
                    </div>
                </li>
            </ul>
        </div>

        <div class="chart-container">
            <canvas id="postChart"></canvas>
        </div>
    `;

    // Lấy dữ liệu cho chart
    const res = await fetch("/posts/stats");
    const data = await res.json();

    const labels = data.map(item => item._id);
    const counts = data.map(item => item.count);

    // Vẽ biểu đồ
    new Chart(document.getElementById("postChart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Số bài đăng",
                data: counts,
                backgroundColor: "#1A3D64",
                borderColor: "#1A3D64",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true },
                x: {}
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}



// =======================
// XỬ LÝ CLICK MENU
// =======================
loadPostStats(); // load dashboard mặc định

managePostsBtn.addEventListener("click", loadManagePosts);
manageUsersBtn.addEventListener("click", loadManageUsers);
manageCommentsBtn.addEventListener("click", loadManageComments);
dashboardBtn.addEventListener("click", loadPostStats);


// Hover đổi icon màu
function addHoverEffect(button, icon) {
    button.addEventListener("mouseenter", () => icon.classList.add("hover-img"));
    button.addEventListener("mouseleave", () => icon.classList.remove("hover-img"));
}

addHoverEffect(managePostsBtn, managePostsIcon);
addHoverEffect(manageUsersBtn, manageUsersIcon);
addHoverEffect(manageCommentsBtn, manageCommentsIcon);
addHoverEffect(dashboardBtn, dashboardIcon);
