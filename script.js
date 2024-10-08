document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelector('.nav-links');
    const burgerMenu = document.querySelector('.burger-menu');
    const loadingOverlay = document.getElementById('loading-overlay');
    const backgrounds = ['eyes0.png', 'eyes1.png', 'eyes2.png', 'eyes3.png', 'eyes4.png', 'eyes5.png'];

    // Function to hide the loading overlay
    function hideLoadingOverlay() {
        // Set opacity to 0 to initiate the fade-out transition
        loadingOverlay.style.opacity = 0;

        // Wait for the transition to complete before hiding the overlay
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500); // Adjust the duration to match the transition duration in CSS
    }

    // Function to select a random background image and apply it to elements with the "bg" class
    function setRandomBackground() {
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        const randomBackground = backgrounds[randomIndex];
        const imageUrl = `url("images/backgrounds/${randomBackground}")`;
        document.querySelectorAll('.bg').forEach(element => {
            element.style.backgroundImage = imageUrl;
        });
    }

    // Introduce a 1-second delay before hiding the loading overlay
    setTimeout(hideLoadingOverlay, 200);

    // Set random background on page load if .bg class elements exist
    if (document.querySelector('.bg')) {
        setRandomBackground();
    }

    burgerMenu.addEventListener('click', function () {
        if (navLinks.classList.contains('show')) {
            // If the menu is currently shown, hide it
            navLinks.style.opacity = 0;

            // Delay hiding the menu to allow time for the fade-out animation
            setTimeout(() => {
                navLinks.classList.remove('show');
            }, 300);
        } else {
            // If the menu is hidden, show it
            navLinks.classList.add('show');

            // Delay showing the menu to allow time for the fade-in animation
            setTimeout(() => {
                navLinks.style.opacity = 1;
            }, 50);
        }
    });

    // Check if the screen size changes
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            // If the screen is larger than 768px, set opacity to visible
            navLinks.style.opacity = 1;
        } else if (window.innerWidth <= 768 && navLinks.classList.contains('show')) {
            // If the screen is smaller than or equal to 768px and the menu is open, set opacity to visible
            navLinks.style.opacity = 1;
        }
    });

    // Close the menu if a click occurs outside of it only on mobile screens
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickInsideBurger = burgerMenu.contains(event.target);

        if (window.innerWidth <= 768 && !isClickInsideNav && !isClickInsideBurger) {
            // If the click is outside the menu on a mobile screen, hide it
            navLinks.style.opacity = 0;

            // Delay hiding the menu to allow time for the fade-out animation
            setTimeout(() => {
                navLinks.classList.remove('show');
            }, 300);
        }
    });
});
