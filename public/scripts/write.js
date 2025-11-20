document.addEventListener('DOMContentLoaded', () => {

    // --- Phần 1: Header hiển thị thông tin người dùng và logic ---
    const usernameSpan = document.getElementById('username-span');
    const avatarLink = document.getElementById('avatar-link');
    const avatarImg = document.getElementById('avatar-img');
    const publishButton = document.getElementById('publish-button');

    // Hàm tự động lấy thông tin user hiện tại và populate header
    (async function populateHeader() {
        try {
            const response = await fetch('/current');
            if (!response.ok) {
                // Nếu chưa đăng nhập, redirect sang trang login
                window.location.href = '/login.html';
                return;
            }
            const user = await response.json();

            // Hiển thị username, link và avatar
            usernameSpan.textContent = '@' + user.username;
            avatarLink.href = `/profile/${user._id}`;
            avatarImg.src = user.profilePicture;
            avatarImg.alt = `${user.username}'s avatar`;

        } catch (error) {
            console.error('Lỗi khi fetch user cho header viết bài:', error);
        }
    })();

    // Xử lý nút Publish: bấm nút này sẽ trigger nút submit của form
    publishButton.addEventListener('click', () => {
        const form = document.querySelector('.post-form');
        if (form) {
            const submitButton = form.querySelector('#form-submit-button');
            if (submitButton) {
                submitButton.click();
            }
        }
    });

    // --- Phần 2: Logic Markdown Preview ---
    const form = document.querySelector('.post-form');
    const markdownInput = document.getElementById('content');
    const previewOutput = document.getElementById('preview');

    // Lấy chiều cao tối thiểu của editor từ CSS variable, fallback = 300px
    const baseMinEditorHeight = parseInt(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--editor-min-height')
    ) || 300;

    if (markdownInput && previewOutput) {
        // Khởi tạo markdown-it từ CDN
        const md = window.markdownit({
            html: false,    // không cho phép HTML raw
            breaks: true,   // xuống dòng tự động
            linkify: true   // tự động chuyển text thành link
        });

        // Hàm update preview
        function updatePreview() {
            const rawText = markdownInput.value;

            // Render Markdown sang HTML
            const rawHtml = md.render(rawText);

            // Làm sạch HTML để tránh XSS
            const cleanHtml = DOMPurify.sanitize(rawText ? rawHtml : '');

            // Hiển thị preview
            previewOutput.innerHTML = cleanHtml;

            // Reset chiều cao editor về auto trước khi tính toán lại
            markdownInput.style.height = 'auto';

            const newHeight = Math.max(markdownInput.scrollHeight, baseMinEditorHeight);
            markdownInput.style.height = newHeight + 'px';
            previewOutput.style.minHeight = newHeight + 'px';
        }

        // Gắn sự kiện input để cập nhật preview khi người dùng nhập
        markdownInput.addEventListener('input', updatePreview);

        // Gọi lần đầu để hiển thị preview mặc định
        updatePreview();
    }
});
