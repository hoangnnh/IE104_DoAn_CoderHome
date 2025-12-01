document.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Header Population & Logic ---
    const usernameSpan = document.getElementById('username-span');
    const avatarLink = document.getElementById('avatar-link');
    const avatarImg = document.getElementById('avatar-img');
    const publishButton = document.getElementById('publish-button');

    (async function populateHeader() {
        try {
            const response = await fetch('/current');
            if (!response.ok) {
                window.location.href = '/login.html'; // Redirect to login page
                return;
            }
            const user = await response.json();

            usernameSpan.textContent = '@' + user.username;
            avatarLink.href = `/profile/${user._id}`;
            avatarImg.src = user.profilePicture;
            avatarImg.alt = `${user.username}'s avatar`;

        } catch (error) {
            console.error('Error fetching user for write header:', error);
        }
    })();

    publishButton.addEventListener('click', () => {
        const form = document.querySelector('.post-form');
        if (form) {
            const submitButton = form.querySelector('#form-submit-button');
            if (submitButton) {
                submitButton.click();
            }
        }
    });

    // Markdown Preview Logic'
    const form = document.querySelector('.post-form');
    const markdownInput = document.getElementById('content');
    const previewOutput = document.getElementById('preview');

    const baseMinEditorHeight = parseInt(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--editor-min-height')
    ) || 300;

    if (markdownInput && previewOutput) {
        const md = window.markdownit({
            html: false,
            breaks: true,
            linkify: true
        });

        function updatePreview() {
            const rawText = markdownInput.value;

            // Use render() in markdown-it from CDN script
            const rawHtml = md.render(rawText);

            // Use DOMPurify.sanitize() from the CDN script
            const cleanHtml = DOMPurify.sanitize(rawText ? rawHtml : '');

            previewOutput.innerHTML = cleanHtml;

            // Reset height to auto to shrink if text is deleted
            markdownInput.style.height = 'auto';

            const newHeight = Math.max(markdownInput.scrollHeight, baseMinEditorHeight);
            markdownInput.style.height = newHeight + 'px';
            previewOutput.style.minHeight = newHeight + 'px';
        }

        markdownInput.addEventListener('input', updatePreview);

        updatePreview();
    }
});