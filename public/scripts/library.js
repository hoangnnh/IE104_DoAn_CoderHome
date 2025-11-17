const navItems = document.querySelectorAll(".library-nav__items");
const yourListSection = document.getElementById("section-yourlist");
const historySection = document.getElementById("section-history");

navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    navItems.forEach(i => i.classList.remove("active"));

    item.classList.add("active");

    const tab = item.dataset.tab;

    if (tab === "yourlist") {
      yourListSection.style.display = "block";
      historySection.style.display = "none";
    } else {
      yourListSection.style.display = "none";
      historySection.style.display = "block";
      loadHistory(); // load from backend
    }
  });
});

//Load List (FE only) 

function loadYourList() {
  const container = document.getElementById("yourListContainer");

  container.innerHTML = `
    <div class="list-card">
      <div class="list-info">
        <img class="avatar" src="/images/user-avatar.jpg" />
        <p class="list-author">YourName</p>
        <h3 class="list-title">Web Dev List</h3>
        <p class="list-count">3 posts</p>
      </div>

      <div class="list-thumbnail">
        <img src="https://i.imgur.com/ctZQZNP.jpeg" />
        <img src="https://i.imgur.com/ctZQZNP.jpeg" />
        <img src="https://i.imgur.com/ctZQZNP.jpeg" />
      </div>
    </div>
  `;
}

loadYourList();


//Load History (from backend)

async function loadHistory() {
  const res = await fetch("/history");
  const data = await res.json();

  const container = document.getElementById("historyContainer");

  container.innerHTML = data.map(post => `
    <div class="list-card">
      <div class="list-info">
        <h3>${post.title}</h3>
        <p>${post.description.substring(0, 100)}...</p>
      </div>
      <div class="list-thumbnail1">
        <img src="${post.thumbnailUrl}" />
      </div>
    </div>
  `).join("");
}

// Delete History
const btnDelete = document.querySelector(".btn-delete");

if (btnDelete) {
  btnDelete.addEventListener("click", async () => {
    const confirmDelete = confirm("Bạn có chắc muốn xóa lịch sử xem hem?");
    if (!confirmDelete) return;

    await fetch("/history/clear", {
      method: "DELETE"
    });

    loadHistory(); //reload history after delect
  });
}