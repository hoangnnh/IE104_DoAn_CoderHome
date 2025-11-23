const headerCSS = `
<link rel="stylesheet" href="/styles/partials/header.css">
`;

const headerHTML = `
<header class=header>
  <div class=header__left>
    <!-- Menu button -->
    <button id="menu-trigger-btn" class=header__menu-btn aria-label="Open menu">
      <img alt="toggle menu" src=/images/icons/menu-icon.svg>
    </button>
    <!-- Logo -->
    <a class=header__logo href="/">
      <img alt=Logo src=/images/logos/website-logo.png class=header__logo-img>
    </a>
    <!-- Search input -->
    <label aria-label=Search class=header__search>
      <img alt="search icon" src=/images/icons/search-icon.svg class=header__search-icon>
      <input class=header__search-input name="search-value" placeholder=Search type=search>
    </label>
  </div>
  <div class=header__right>
    <!-- Write button -->
    <a class=header__write-btn href=/write title=Write>
      <img alt="write icon" src=/images/icons/write-icon.svg>
      <span>Write</span>
    </a>
    <!-- Notification button -->
    <button id="notification-trigger-btn" class=header__notification-btn title=Notifications>
      <img alt="notification icon" src=/images/icons/notification-icon.svg>
    </button>
    <!-- User avatar -->
    <a id="avatar-link" href="#" aria-label="Profile">
      <img id="avatar-img" alt="Your avatar" src="/images/samples/author-avt-2.jpg" class=header__avatar>
    </a>
  </div>
</header>
`;

class Header extends HTMLElement {
  constructor() {
    super();
    // Attach shadow DOM to encapsulate styles and markup
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = headerCSS + headerHTML;
    // Clone the template content into the shadow DOM
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Dynamic elements for later use
    this.avatarLink = this.shadowRoot.getElementById('avatar-link');
    this.avatarImg = this.shadowRoot.getElementById('avatar-img');
    this.menuTrigger = this.shadowRoot.getElementById('menu-trigger-btn');
    this.notificationTrigger = this.shadowRoot.getElementById('notification-trigger-btn');
  }

  async connectedCallback() {
    // Menu click handler
    this.menuTrigger.addEventListener('click', () => {
      // Check if menu is already open
      const menuOpen = document.querySelector("toggle-menu").isOpen;
      if (!menuOpen) document.dispatchEvent(new CustomEvent('close-all'));
      // Toggle the menu open/close
      document.dispatchEvent(new CustomEvent('toggle-menu'));
    });

    // Notification click handler
    this.notificationTrigger.addEventListener('click', () => {
      const notificationOpen = document.querySelector("toggle-notification").isOpen;
      if (!notificationOpen) document.dispatchEvent(new CustomEvent('close-all'));
      document.dispatchEvent(new CustomEvent('toggle-notifications'));
    });

    // Avatar click handler
    this.avatarLink.addEventListener("click", () => {
      const avatarOpen = document.querySelector("toggle-avatar-option").isOpen;
      if (!avatarOpen) {
        document.dispatchEvent(new CustomEvent("close-all"));
      }
      document.dispatchEvent(new CustomEvent("toggle-avatar-option"));
    });

    // Search input enter key handler
    const searchInput = this.shadowRoot.querySelector(".header__search-input");
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          // Navigate to search results page
          window.location.href = `/search-result?q=${encodeURIComponent(query)}`;
        }
      }
    });

    // Fetch current user information
    try {
      const response = await fetch('/current');
      if (!response.ok) {
        // Redirect to login page if not authenticated
        if (!['/login', '/register', '/'].includes(location.pathname)) {
          window.location.href = '/login';
        }
        return;
      }
      const user = await response.json();

      // Update avatar image and alt text
      this.avatarImg.src = user.profilePicture;
      this.avatarImg.alt = `${user.username}'s avatar`;

    } catch (error) {
      console.error('Error fetching user for header:', error);
    }
  }
}

// Define the custom element
customElements.define('coderhome-header', Header);
