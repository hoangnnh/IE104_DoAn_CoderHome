document.addEventListener("DOMContentLoaded", function () {
    const navButtons = document.querySelectorAll(".nav_item button");
    const flexBox = document.querySelector(".flex_box");

    const tabContents = {
        account: `
            <button class="mail_name_btn">
                <span class="big_span">
                    <span class="left"><p>Email address</p></span>
                    <span class="right"><p>nhuhinhtrinh@gmail.com</p></span>
                </span>
            </button>

            <button class="mail_name_btn">
                <span class="big_span">
                    <span class="left"><p>Username</p></span>
                    <span class="right"><p>@zingjyuhing</p></span>
                </span>
            </button>

            <button class="setting_btn">
                <div class="big_span">
                    <span class="left">
                        <p>Profile information</p><br>
                        <p class="bellow">Edit name, photo pronouns, short bio, etc.</p>
                    </span>
                    <span class="right">
                        <p class="p1">Như Hinh Trịnh</p>
                        <img src="../../public/images/user-avatar.jpg" alt="" class="right_img">
                    </span>
                </div>
            </button>

            <button class="setting_btn">
                <div class="big_span">
                    <span class="left">
                        <p>Profile design</p><br>
                        <p class="bellow">Customize the appearance of your profile.</p>
                    </span>
                    <span class="right">
                        <i class="ti-new-window"></i>
                    </span>
                </div>
            </button>

            <button class="setting_btn">
                <div class="big_span">
                    <span class="left">
                        <p>Custom domain</p><br>
                        <p class="bellow">Upgrade to a Coderhome Membership to redirect your Profile</p>
                    </span>
                    <span class="right">
                        <p>None</p>
                        <i class="ti-new-window"></i>
                    </span>
                </div>
            </button>

            <span class="line"></span>

            <button class="setting_btn">
                <div class="big_span">
                    <span class="left">
                        <p>Partner Program</p><br>
                        <p class="bellow">You are not enrolled in the Partner Program.</p>
                    </span>
                    <span class="right">
                        <i class="ti-new-window"></i>
                    </span>
                </div>
            </button>

            <button class="setting_btn">
                <div class="big_span">
                    <span class="left">
                        <p>Your CoderHome Digest frequency</p><br>
                        <p class="bellow">Adjust how often you see a new Digest.</p>
                    </span>
                    <span class="right">
                        <p class="p2">Daily</p>
                        <i class="ti-angle-down"></i>
                    </span>
                </div>
            </button>

            <span class="line"></span>

            <button class="setting_btn">
                <div class="big_span">
                    <span class="left">
                        <p class="p_del">Deactivate account</p><br>
                        <p class="bellow">Deactivating will suspend your account until you sign back in.</p>
                    </span>
                </div>
            </button>

            <button class="setting_btn">
                <div class="big_span">
                    <span class="left">
                        <p class="p_del">Delete account</p><br>
                        <p class="bellow">Permanently delete your account and all of your content.</p>
                    </span>
                </div>
            </button>
        `,

        notifications: `
            <div style="padding: 20px 0; font-family: 'Lora', serif;">
                <h3 style="margin-bottom: 20px; font-size: 20px;">Email Notifications</h3>
                
                <button class="setting_btn">
                    <div class="big_span">
                        <span class="left">
                            <p>New story from writers you follow</p>
                        </span>
                        <span class="right">
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </span>
                    </div>
                </button>

                <button class="setting_btn">
                    <div class="big_span">
                        <span class="left">
                            <p>Recommended stories</p>
                        </span>
                        <span class="right">
                            <label class="switch">
                                <input type="checkbox">
                                <span class="slider"></span>
                            </label>
                        </span>
                    </div>
                </button>

                <span class="line"></span>

                <h3 style="margin: 20px 0; font-size: 20px;">Push Notifications</h3>

                <button class="setting_btn">
                    <div class="big_span">
                        <span class="left">
                            <p>Claps on your stories</p>
                        </span>
                        <span class="right">
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </span>
                    </div>
                </button>
            </div>
        `,

        memberships: `
            <div style="padding: 20px 0; font-family: 'Lora', serif;">
                <h3 style="margin-bottom: 20px; font-size: 20px;">Your Memberships</h3>
                
                <div style="padding: 15px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; opacity: 0.8;">You are not a member of any publications.</p>
                </div>

                <button class="setting_btn">
                    <div class="big_span">
                        <span class="left">
                            <p>Find publications to support</p>
                        </span>
                        <span class="right">
                            <i class="ti-arrow-right"></i>
                        </span>
                    </div>
                </button>

                <span class="line"></span>

                <button class="setting_btn">
                    <div class="big_span">
                        <span class="left">
                            <p>Gift a membership</p><br>
                            <p class="bellow">Give the gift of unlimited access.</p>
                        </span>
                        <span class="right">
                            <i class="ti-gift"></i>
                        </span>
                    </div>
                </button>
            </div>
        `
    };


function switchTab(tabName) {
        navButtons.forEach(btn => {
            btn.parentElement.classList.remove("active");
            btn.classList.remove("nav_btn1");
            btn.classList.add("nav_btn");
        });

        const activeButton = Array.from(navButtons).find(btn => 
            btn.textContent.trim() === tabName
        );
        if (activeButton) {
            activeButton.parentElement.classList.add("active");
            activeButton.parentElement.classList.add("active");
        }

        flexBox.innerHTML = tabContents[tabName.toLowerCase()] || tabContents.account;
    }

    navButtons.forEach(button => {
        button.addEventListener("click", function () {
            const tabName = this.textContent.trim();
            switchTab(tabName);
        });
    });

    switchTab("Account");
});