const modalCSS = `
<link rel="stylesheet" href="/styles/partials/notification.css">
`;

const modalHTML = `
<div class="modal__overlay" id="modalOverlay"></div>
<div class="modal__content" id="modalContent">
    <div class="modal__header">
        <h2 class="modal__title">Notification</h2>
        <button class="modal__close-btn" id="modalCloseBtn" aria-label="Close notifications">
             <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    </div>
    <div class="modal__tabs">
        <button class="modal__tab-btn is-active" data-tab="all">All</button>
        <button class="modal__tab-btn" data-tab="unread">Unread</button>
    </div>
    <ul class="notification-list" id="notificationList">
        <!-- Notifications will be loaded here -->
    </ul>
</div>
`;

// Mock Data
const mockNotifications = [
  {
    id: 1,
    user: { name: "Khoibui", avatar: "/images/user-avatar.jpg" },
    text: "has just posted a new article...",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    user: { name: "Hoang Teddy", avatar: "/images/user-avatar.jpg" },
    text: "liked your comment.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    user: { name: "Nguyen Kien", avatar: "/images/samples/default-avt.png" },
    text: "started following you.",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 4,
    user: { name: "Khoibui", avatar: "/images/samples/author-avt-1.png" },
    text: "has just posted a new article...",
    time: "2 hour ago",
    unread: false,
  },
  {
    id: 5,
    user: { name: "Admin", avatar: "/images/user-avatar.jpg" },
    text: "Welcome to Coderhome!",
    time: "1 day ago",
    unread: false,
  },
];

class NotificationModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this.filter = "all"; // 'all' or 'unread'
  }

  connectedCallback() {
    // Render the component's static HTML and CSS
    const template = document.createElement("template");
    template.innerHTML = modalCSS + modalHTML;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Find internal elements
    this.modal = this.shadowRoot.getElementById("modalContent");
    this.overlay = this.shadowRoot.getElementById("modalOverlay");
    this.list = this.shadowRoot.getElementById("notificationList");
    this.closeBtn = this.shadowRoot.getElementById("modalCloseBtn");
    this.tabButtons = this.shadowRoot.querySelectorAll(".modal__tab-btn");

    // Add event listeners
    this.closeBtn.addEventListener("click", () => this.close());
    this.overlay.addEventListener("click", () => this.close());
    document.addEventListener("toggle-notifications", () => this.toggle());

    this.tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Set the new filter
        this.filter = btn.dataset.tab;
        // Update active tab style
        this.tabButtons.forEach((t) => t.classList.remove("is-active"));
        btn.classList.add("is-active");
        // Re-render the list with the new filter
        this.renderNotifications();
      });
    });
  }

  toggle() {
    console.log("notification button");
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.open();
    else this.close();
  }

  open() {
    this.modal.classList.add("is-active");
    this.overlay.classList.add("is-active");
    this.isOpen = true;
    // Fetch and render notifications when opened
    this.renderNotifications();
  }

  close() {
    this.modal.classList.remove("is-active");
    this.overlay.classList.remove("is-active");
    this.isOpen = false;
  }

  renderNotifications() {
    // Filter the mock data
    const filteredData = mockNotifications.filter((n) => {
      if (this.filter === "unread") return n.unread;
      return true; // 'all' filter
    });

    if (filteredData.length === 0) {
      this.list.innerHTML = `<li class="notification-item--empty">No new notifications</li>`;
      return;
    }

    // Render list
    this.list.innerHTML = filteredData
      .map((n) => {
        return `
                <li class="notification-item ${n.unread ? "is-unread" : ""}">
                    <img src="${n.user.avatar}" alt="${
          n.user.name
        }'s avatar" class="notification-item__avatar">
                    <div class="notification-item__content">
                        <p class="notification-item__text">
                            <strong>${n.user.name}</strong> ${n.text}
                        </p>
                        <span class="notification-item__time">${n.time}</span>
                    </div>
                </li>
            `;
      })
      .join("");
  }
}

customElements.define("toggle-notification", NotificationModal);
