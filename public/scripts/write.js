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
        const form = document.getElementById('post-form');
        if (form) {
            const submitButton = form.querySelector('#form-submit-button');
            if (submitButton) {
                submitButton.click();
            }
        }
    });

    // --- Part 2: Markdown Preview Logic ---
    const markdownInput = document.getElementById('content');
    const previewOutput = document.getElementById('preview');

    if (markdownInput && previewOutput) {
        function updatePreview() {
            const rawText = markdownInput.value;
            
            // Use marked.parse() from the CDN script
            const rawHtml = marked.parse(rawText);
            
            // Use DOMPurify.sanitize() from the CDN script
            const cleanHtml = DOMPurify.sanitize(rawText ? rawHtml : '');
            
            previewOutput.innerHTML = cleanHtml;

            // --- Auto-expand logic ---
            // 1. Reset height to auto to shrink if text is deleted
            markdownInput.style.height = 'auto'; 
            
            // 2. Set the new height based on scroll content
            const newHeight = markdownInput.scrollHeight;
            markdownInput.style.height = newHeight + 'px';

            // 3. Make the preview pane match the editor height
            previewOutput.style.minHeight = newHeight + 'px';
        }
        
        // This is now the ONLY input listener
        markdownInput.addEventListener('input', updatePreview);
        
        updatePreview(); // Initial render
    }
});