document.addEventListener("DOMContentLoaded", async function () {

    const navButtons = document.querySelectorAll(".nav_item button");
    const flexBox = document.querySelector(".flex_box");

 
   // content cho từng tab
   
    const tabContents = {
        // ACCOUNT TAB
        account: `
            <button class="mail_name_btn">
                <span class="big_span">
                    <span class="left"><p>Email address</p></span>
                    <span class="right"><p>{{email}}</p></span>
                </span>
            </button>

            <button class="mail_name_btn">
                <span class="big_span">
                    <span class="left"><p>Username</p></span>
                    <span class="right"><p>@{{username}}</p></span>
                </span>
            </button>

            <button class="setting_btn">
                <div class="big_span">
                    <span class="left">
                        <p>Profile information</p><br>
                        <p class="bellow">Edit name, photo pronouns, short bio, etc.</p>
                    </span>
                    <span class="right">
                        <p class="p1">{{username}}</p>
                        <img src="{{avatar}}" alt="" class="right_img">
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
                        <p class="p1">Your CoderHome Digest frequency</p><br>
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

        // NOTIFICATIONS TAB
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

        // MEMBERSHIPS TAB
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

  // tạo biến lưu thông tin user hiện tại
    let currentUser = null;

    async function loadUser() {
        try {
            const res = await fetch("/current", { credentials: "include" });
            const data = await res.json();

            if (data && data._id) {
                currentUser = {
                    email: data.email,
                    name: data.name,
                    username: data.username,
                    avatar: data.profilePicture
                };
            }

        } catch (err) {
            console.log("Fetch user error:", err);
        }
    }

    await loadUser();

   // thay đổi template với dữ liệu user
    function parseTemplate(html, user) {
        return html
            .replace(/{{email}}/g, user.email)
            .replace(/{{name}}/g, user.name)
            .replace(/{{username}}/g, user.username)
            .replace(/{{avatar}}/g, user.avatar);
    }

// switch tab function
    function switchTab(tabName) {

        navButtons.forEach(btn => {
            btn.parentElement.classList.remove("active");
            btn.classList.remove("nav_btn1");
            btn.classList.add("nav_btn");
        });

        const activeButton = Array.from(navButtons).find(
            btn => btn.textContent.trim() === tabName
        );
        if (activeButton) activeButton.parentElement.classList.add("active");

        const rawHTML = tabContents[tabName.toLowerCase()] || tabContents.account;

        if (currentUser) {
            flexBox.innerHTML = parseTemplate(rawHTML, currentUser);
        } 
    }
 
// click event listeners
    navButtons.forEach(button => {
        button.addEventListener("click", function () {
            switchTab(this.textContent.trim());
        });
    });

    switchTab("Account");

});

