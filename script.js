document.addEventListener('DOMContentLoaded', function() {
    // Add scrollbar width calculation at the start
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Add loading state variable
    let isAnimating = false;
    const background = document.querySelector('.background');
    
    // Add null check for background blur
    if (background) {
        setTimeout(() => {
            background.classList.add('blurred');
        }, 0);
    }

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    const links = document.querySelectorAll('.nav-links li');

    // Check if elements exist before adding event listeners
    if (hamburger && navLinks && overlay) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            overlay.classList.toggle('active');

            // Animate Links
            links.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });

        // Add transitionend listener to overlay to remove animation class
        overlay.addEventListener('transitionend', () => {
            if (overlay.classList.contains('active')) {
                // Keep animation styles if active
            } else {
                overlay.classList.remove('active');
            }
        });

        // Add resize handler to prevent animation during window resizing
        let resizeTimer;
        window.addEventListener('resize', function() {
            // Add the no-transition class
            navLinks.classList.add('no-transition');
            overlay.classList.add('no-transition');
            
            // If window is smaller than 768px and menu is active, close it without animation
            if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
            }
            
            // Clear the existing timer
            clearTimeout(resizeTimer);
            
            // Set a timer to remove the no-transition class after resize is complete
            resizeTimer = setTimeout(function() {
                navLinks.classList.remove('no-transition');
                overlay.classList.remove('no-transition');
            }, 100);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        // Close menu when link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
            });
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            });
        });

        // Handle overlay click to close menu
        overlay.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // Lightbox functionality - Add null checks
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) { // Only initialize lightbox functionality if element exists
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const galleryImages = document.querySelectorAll('.gallery-img');
        let currentAnimation = null;
        let initialRect = null; // Variable to store the initial position/size

        // Only set up lightbox events if we have both the lightbox and gallery images
        if (lightboxImg && closeBtn && galleryImages.length > 0) {
            function openLightbox(sourceImage) {
                if (currentAnimation) {
                    currentAnimation.forEach(timeout => clearTimeout(timeout));
                }
                currentAnimation = [];

                function setPosition(animate = true) {
                    const viewportWidth = document.documentElement.clientWidth;
                    const viewportHeight = window.innerHeight;
                    const aspectRatio = sourceImage.naturalHeight / sourceImage.naturalWidth;
                    
                    // First, calculate target size
                    const targetWidth = Math.min(viewportWidth * 0.9, viewportHeight * 1.6);
                    const targetHeight = targetWidth * aspectRatio;
                    
                    // Force hardware acceleration
                    lightboxImg.style.transform = 'translateZ(0)';
                    lightboxImg.style.willChange = 'top, left, width, height';
                    
                    if (!animate) {
                        lightboxImg.style.transition = 'none';
                    }
                    
                    lightboxImg.style.width = `${targetWidth}px`;
                    lightboxImg.style.height = `${targetHeight}px`;
                    lightboxImg.style.top = `${(viewportHeight - targetHeight) / 2}px`;
                    lightboxImg.style.left = `${(viewportWidth - targetWidth) / 2}px`;
                    
                    if (!animate) {
                        // Force reflow
                        lightboxImg.offsetHeight;
                        lightboxImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    }
                }

                // Initial setup
                const rect = sourceImage.getBoundingClientRect();
                initialRect = rect; // Store the initial rect
                lightboxImg.src = sourceImage.src;
                lightboxImg.style.position = 'fixed';
                lightboxImg.style.transition = 'none';
                lightboxImg.style.display = 'block';
                lightboxImg.style.width = `${rect.width}px`;
                lightboxImg.style.height = `${rect.height}px`;
                lightboxImg.style.top = `${rect.top}px`;
                lightboxImg.style.left = `${rect.left}px`;
                
                // Force reflow before adding transitions
                lightboxImg.offsetHeight;
                
                document.body.style.paddingRight = '12px';
                document.body.classList.add('lightbox-open');

                // Clean up old handler and create new one
                if (window.lightboxResizeHandler) {
                    window.removeEventListener('resize', window.lightboxResizeHandler);
                }
                
                window.lightboxResizeHandler = () => {
                    if (lightbox.classList.contains('active')) {
                        setPosition(false);
                    }
                };
                
                window.addEventListener('resize', window.lightboxResizeHandler);
                
                // Start animation
                requestAnimationFrame(() => {
                    lightbox.classList.add('active');
                    lightboxImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    setPosition(true);
                });

                currentAnimation.push(setTimeout(() => {
                    currentAnimation = null;
                }, 400));
            }

            function closeLightbox() {
                if (currentAnimation) {
                    currentAnimation.forEach(timeout => clearTimeout(timeout));
                }
                currentAnimation = [];

                const sourceImage = [...galleryImages].find(img => img.src === lightboxImg.src);
                // Use the stored initialRect if available
                if (sourceImage && initialRect) {
                    // const rect = sourceImage.getBoundingClientRect(); // No longer needed
                    lightbox.classList.remove('active');

                    lightboxImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    Object.assign(lightboxImg.style, {
                        top: `${initialRect.top}px`, // Use stored value
                        left: `${initialRect.left}px`, // Use stored value
                        width: `${initialRect.width}px`, // Use stored value
                        height: `${initialRect.height}px` // Use stored value
                    });

                    currentAnimation.push(setTimeout(() => {
                        window.removeEventListener('resize', window.lightboxResizeHandler);
                        document.body.classList.remove('lightbox-open');
                        document.body.style.paddingRight = '';
                        lightboxImg.removeAttribute('style');
                        lightboxImg.src = '';
                        lightboxImg.style.display = 'none';
                        currentAnimation = null;
                        initialRect = null; // Reset stored rect
                    }, 400));
                } else {
                    // Immediate cleanup if something went wrong or initialRect missing
                    lightbox.classList.remove('active');
                    document.body.classList.remove('lightbox-open');
                    document.body.style.paddingRight = '';
                    lightboxImg.removeAttribute('style');
                    lightboxImg.src = '';
                    lightboxImg.style.display = 'none';
                    currentAnimation = null;
                    initialRect = null; // Reset stored rect
                }
            }

            galleryImages.forEach(img => {
                img.addEventListener('click', () => openLightbox(img));
            });

            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', e => {
                if (e.target === lightbox) closeLightbox();
            });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox(); // Use the same closeLightbox function instead of immediate cleanup
                }
            });
        }
    }

    // Custom Select Implementation
    const customSelect = document.querySelector('.custom-select');
    if (customSelect) { // Add null check
        const selectSelected = customSelect.querySelector('.select-selected');
        const selectItems = customSelect.querySelector('.select-items');
        const hiddenInput = customSelect.querySelector('input[type="hidden"]');

        selectSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            selectSelected.classList.toggle('select-arrow-active');
            selectItems.classList.toggle('select-hide');
            customSelect.classList.toggle('active');
        });

        const selectOptions = selectItems.querySelectorAll('div');
        selectOptions.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                selectSelected.textContent = this.textContent;
                hiddenInput.value = this.getAttribute('data-value');
                selectItems.classList.add('select-hide');
                selectSelected.classList.remove('select-arrow-active');
                customSelect.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
            customSelect.classList.remove('active');
        });
    }
});

function validateEmail() {
    const email = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    return true;
}