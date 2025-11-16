const avatarOptionCSS = `
<link rel="stylesheet" href="/styles/partials/avatar-option.css">
`;

const avatarOptionHTML = `
<div class="avatar-option__overlay" id="avatarOverlay"></div>

<div class="avatar__option" id="avatarOption">
    <div class="avatar__basic-info">
        <img src="/images/user-avatar.jpg" alt="" class="avatar-image" id="avatarImg">
        <p class="user-name" id="userName">User</p>
    </div>

    <hr class="divider">

    <ul class="option__list">
        <a href="" class="option__item" id="userProfile">
            <p>Information</p>
            <img src="/images/account-circle-outline.svg" class="option__item-image">
        </a>
        <a href="/setting" class="option__item">
            <p>Setting</p>
            <img src="/images/cog-outline.svg" class="option__item-image">
        </a>
        <a href="/help" class="option__item">
            <p>Help</p>
            <img src="/images/help-circle-outline.svg" class="option__item-image">
        </a>
        <a href="/logout" class="option__item" id="logoutBtn">
            <p>Log Out</p>
            <img src="/images/logout.svg" class="option__item-image">
        </a>
    </ul>

    <hr class="divider">

    <ul class="nav__list">
        <li class="nav__item"><a href="/help">Help</a></li>
        <li class="nav__item"><a href="#">Status</a></li>
        <li class="nav__item"><a href="/about">About</a></li>
        <li class="nav__item"><a href="#">Press</a></li>
        <li class="nav__item"><a href="#">Privacy</a></li>
        <li class="nav__item"><a href="#">Term</a></li>
    </ul>
</div>
`;

class AvatarOption extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const template = document.createElement("template");
        template.innerHTML = avatarOptionCSS + avatarOptionHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // DOM elements
        this.optionBox = this.shadowRoot.getElementById("avatarOption");
        this.overlay = this.shadowRoot.getElementById("avatarOverlay");

        // Close when clicking outside
        this.overlay.addEventListener("click", () => this.close());

        // Listen for open/close event from header
        document.addEventListener("toggle-avatar-option", () => {
            if (this.optionBox.classList.contains("is-active")) {
                this.close();
            } else {
                this.open();
            }
        });

        // Load user info
        try {
            const res = await fetch("/current");
            if (res.ok) {
                const user = await res.json();
                this.shadowRoot.getElementById("avatarImg").src = user.profilePicture;
                this.shadowRoot.getElementById("userName").textContent = user.username;
                this.shadowRoot.getElementById("userProfile").href = `/profile/${user._id}`;
                
            }
        } catch (e) {
            console.error("Cannot load user info in avatar option:", e);
        }

        // Enable animation after render
        setTimeout(() => {
            this.optionBox.classList.add("ready");
            this.overlay.classList.add("ready");
        }, 0);
    }

    open() {
        this.optionBox.classList.add("is-active");
        this.overlay.classList.add("is-active");
    }

    close() {
        this.optionBox.classList.remove("is-active");
        this.overlay.classList.remove("is-active");
    }
}

customElements.define("toggle-avatar-option", AvatarOption);
