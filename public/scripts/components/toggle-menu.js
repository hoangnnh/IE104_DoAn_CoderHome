document.addEventListener('DOMContentLoaded', () => {

    // --- Toggle Menu Logic ---
    
    // Get all the elements we need
    const menuTrigger = document.getElementById('menu-trigger-btn');
    const menuClose = document.getElementById('menuCloseBtn');
    const toggleMenu = document.getElementById('toggleMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    // Check if all elements exist on the page
    if (menuTrigger && menuClose && toggleMenu && menuOverlay) {
        
        // Function to open the menu
        const openMenu = () => {
            toggleMenu.classList.add('is-active');
            menuOverlay.classList.add('is-active');
        };

        // Function to close the menu
        const closeMenu = () => {
            toggleMenu.classList.remove('is-active');
            menuOverlay.classList.remove('is-active');
        };

        // Event Listeners
        menuTrigger.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);

    } else {
        console.warn('Toggle menu elements not found. Make sure all IDs are correct.');
    }

    // --- You can add other global scripts here ---

});