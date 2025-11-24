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

// Load List (FE only) 

async function loadYourList() {
  const res = await fetch("/current", { credentials: "include" });
  const user = await res.json();
  const container = document.getElementById("yourListContainer");

  container.innerHTML = `
    <div class="list-card-fe">
      <div class="list-info">
        <img class="avatar" src="${user.profilePicture}" />
        <p class="list-author">${user.username}</p>
        <h3 class="list-title">Web Dev List</h3>
        <p class="list-count">3 posts</p>
        <button class = "delete-list">Delete</button>
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

//overlay + create, delete list...

// Mở overlay
const getStarted = document.querySelector(".create-btn")
const closeBtn = document.querySelector(".btn-cancel")
const createList = document.querySelector(".btn-save")
const overlay = document.querySelector(".overlay")
const newList = document.querySelector(".overlay-newlist")
const deleteList = document.querySelectorAll(".delete-list")

getStarted.onclick = () =>{
  overlay.style.display = "flex"
  newList.style.display = "block"
}

closeBtn.onclick = () =>{
  overlay.style.display = "none"
}

createList.onclick = async () =>{
  const inputValues = document.querySelector(".newlist-input").value
  if(!inputValues.trim()){
    alert("Vui lòng nhập tên danh sách")
    return;
  }

  overlay.style.display ="none"

  const res = await fetch("/current", { credentials: "include" });
  const user = await res.json();

  const card = document.createElement("div")
  card.className = "list-card-fe"
  card.innerHTML = `
  <div class="list-info">
        <img class="avatar" src="${user.profilePicture}" />
        <p class="list-author">${user.username}</p>
        <h3 class="list-title">${inputValues}</h3>
        <p class="list-count">0 posts</p>
        <button class = "delete-list">Delete</button>
      </div>

      <div class="list-thumbnail">
        <p>No post yet</p>
      </div>
  `;
  
   yourListContainer.appendChild(card);
   document.querySelector(".newlist-input").value = ""
}

yourListContainer.addEventListener("click" , (e) =>{
    if(e.target.classList.contains("delete-list")){
    e.preventDefault();
    const cardRemove = e.target.closest(".list-card-fe"); 

    if (cardRemove) {
      cardRemove.remove();
    }
  }
})

// Load History (from backend)

async function loadHistory() {
  const res = await fetch("/history");
  const data = await res.json();

  const container = document.getElementById("historyContainer");

  container.innerHTML = data.map(post => `
  <div class="list-card" data-id="${post._id}">
    <div class="list-info">
      <h3>${post.title}</h3>
      <p>${post.description.substring(0, 100)}...</p>
    </div>
    <div class="list-thumbnail1">
      <img src="${post.thumbnailUrl}" />
    </div>
  </div>
`).join("");

// Link to an already read post in history section 
document.querySelectorAll(".list-card").forEach(card => {
  card.addEventListener("click", () => {
    const id = card.dataset.id;
    window.location.href = `/post/${id}`;
  });
});
}

// Delete History
const btnDelete = document.querySelector(".btn-delete");

if (btnDelete) {
  btnDelete.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure that you want to delete history?");
    if (!confirmDelete) return;

    await fetch("/history/clear", {
      method: "DELETE"
    });

    loadHistory(); // reload history after delete
  });
}

