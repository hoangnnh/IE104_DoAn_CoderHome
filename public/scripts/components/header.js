const headerCSS = `
<link rel="stylesheet" href="/styles/partials/header.css">
`;

const headerHTML = `
<header class=header>
  <div class=header__left>
    <button id="menu-trigger-btn" class=header__menu-btn aria-label="Open menu">
      <img alt="toggle menu" src=/images/toggle-menu.png>
    </button>
    <a class=header__logo href="/">
      <img alt=Logo src=/images/logos/website-logo.png class=header__logo-img>
    </a>
    <label aria-label=Search class=header__search><img alt="search icon" src=/images/search-icon.png class=header__search-icon>
      <input class=header__search-input name="search-value" placeholder=Search type=search>
    </label>
  </div>
  <div class=header__right>
    <a class=header__write-btn href=/write title=Write>
      <img alt="write icon" src=/images/write-icon.png>
      <span>Write</span>
    </a>
    <button id="notification-trigger-btn" class=header__notification-btn title=Notifications>
      <img alt="notification icon" src=/images/icons/notification-icon.svg>
    </button>
    <a id="avatar-link" href="#" aria-label="Profile">
      <img id="avatar-img" alt="Your avatar" src="/images/user-avatar.jpg" class=header__avatar>
    </a>
  </div>
</header>
`;

class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = headerCSS + headerHTML;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Dynamic elements
    this.avatarLink = this.shadowRoot.getElementById('avatar-link');
    this.avatarImg = this.shadowRoot.getElementById('avatar-img');
    this.menuTrigger = this.shadowRoot.getElementById('menu-trigger-btn');
    this.notificationTrigger = this.shadowRoot.getElementById('notification-trigger-btn');
  }

  async connectedCallback() {
    this.menuTrigger.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('toggle-menu'));
    });

    this.notificationTrigger.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('toggle-notifications'));
    });

    this.avatarLink.addEventListener("click", (e) => {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent("toggle-avatar-option"));
    });

    try {
      const response = await fetch('/current');
      if (!response.ok) {
        if (!['/login', '/register', '/'].includes(location.pathname)) {
          window.location.href = '/login';
        }
        return;
      }
      const user = await response.json();

      this.avatarImg.src = user.profilePicture;
      this.avatarImg.alt = `${user.username}'s avatar`;

    } catch (error) {
      console.error('Error fetching user for header:', error);
    }
  }
}

customElements.define('coderhome-header', Header);