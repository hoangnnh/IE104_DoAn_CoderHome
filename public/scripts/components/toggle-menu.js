const menuCSS = `
<link rel="stylesheet" href="/styles/partials/toggle-menu.css">
`;

const menuHTML = `
<div class="toggle-menu__overlay" id="menuOverlay"></div>
<aside class="toggle-menu" id="toggleMenu">
    <nav class="toggle-menu__nav">
        <a href="/" class="toggle-menu__item">
            <img class="icon" src="/images/icons/home-icon.svg" alt="home icon">
            <span>Home</span>
        </a>
        <a href="/library" class="toggle-menu__item">
            <img src="/images/icons/bookmark-icon.svg" alt="bookmark icon" class="icon">
            <span>Library</span>
        </a>
        <a id="profile-link" href="#" class="toggle-menu__item profile-link">
            <img src="/images/icons/profile-icon.svg" alt="profile icon" class="icon">
            <span>Profile</span>
        </a>
        <hr class="toggle-menu__divider">
        <a href="/following" class="toggle-menu__item">
            <img src="/images/icons/heart-icon.svg" alt="like icon" class="icon">
            <span>Following</span>
        </a>
    </nav>
</aside>
`;

class ToggleMenu extends HTMLElement {
    constructor() {
        super();
        // Attach shadow DOM for encapsulation
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
    }

    async connectedCallback() {
        // Render the template inside shadow DOM
        const template = document.createElement('template');
        template.innerHTML = menuCSS + menuHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Get internal elements
        this.menuElement = this.shadowRoot.getElementById('toggleMenu');
        this.overlayElement = this.shadowRoot.getElementById('menuOverlay');

        // Close menu when clicking overlay
        this.overlayElement.addEventListener('click', () => this.close());

        // Listen for toggle-menu event from header
        document.addEventListener('toggle-menu', () => {
            // Toggle open/close state
            if (this.menuElement.classList.contains('is-active')) {
                this.close();
            } else {
                this.open();
            }
        });

        // Listen for global close-all event
        document.addEventListener('close-all', () => {
            this.close();
        });

        // Dynamically set profile link based on current user
        try {
            const response = await fetch('/current');
            if (response.ok) {
                const user = await response.json();
                this.shadowRoot.getElementById('profile-link').href = `/profile/${user._id}`;
            }
        } catch (e) {
            console.error("Could not set profile link in menu", e);
        }

        // Enable animation after render
        setTimeout(() => {
            this.menuElement.classList.add('menu-ready');
            this.overlayElement.classList.add('menu-ready');
        }, 0);
    }

    // Open menu
    open() {
        this.menuElement.classList.add('is-active');
        this.overlayElement.classList.add('is-active');
        this.isOpen = true;
    }

    // Close menu
    close() {
        this.menuElement.classList.remove('is-active');
        this.overlayElement.classList.remove('is-active');
        this.isOpen = false;
    }
}

// Define custom element
customElements.define('toggle-menu', ToggleMenu);
