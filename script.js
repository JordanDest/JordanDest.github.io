document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded');

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        initializeEmailJS();
    } else {
        console.error("EmailJS library not loaded");
    }

    // Start the slideshow
    startSlideshow();

    // Slideshow container event listeners for pausing on hover
    const slideshowContainer = document.querySelector(".slideshow-container");
    if (slideshowContainer) {
        slideshowContainer.addEventListener("mouseenter", pauseSlideshow);
        slideshowContainer.addEventListener("mouseleave", startSlideshow);
    }

    // Video control functionality for clipTedTalk.mp4
    const video = document.getElementById('clipTedTalk');
    const videoControls = document.getElementById('video-controls');
    const muteButton = document.getElementById('mute-button');
    const volumeSlider = document.getElementById('volume-slider');
    let hideControlsTimeout;

    function showControls() {
        videoControls.style.display = 'flex';
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            videoControls.style.display = 'none';
        }, 3000);
    }

    if (video && videoControls) {
        video.addEventListener('click', showControls);
        video.addEventListener('mouseover', showControls);
        video.addEventListener('mousemove', showControls);

        muteButton.addEventListener('click', () => {
            video.muted = !video.muted;
            muteButton.textContent = video.muted ? 'Unmute' : 'Mute';
        });

        volumeSlider.addEventListener('input', () => {
            video.volume = volumeSlider.value;
        });

        // Set initial volume
        volumeSlider.value = video.volume;

        // Hide controls initially
        videoControls.style.display = 'none';
    } else {
        console.error('Video or video controls not found');
    }

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const sidebar = document.querySelector('.sidebar');

    console.log('Hamburger:', hamburger);
    console.log('Nav Menu:', navMenu);
    console.log('Sidebar:', sidebar);

    if (hamburger && navMenu && sidebar) {
        hamburger.addEventListener('click', () => {
            console.log('Hamburger clicked');
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            console.log('Menu state:', navMenu.classList);

            // Toggle sidebar
            if (sidebar.style.right === '0px') {
                sidebar.style.right = '-250px'; // Hide sidebar
            } else {
                sidebar.style.right = '0px'; // Show sidebar
            }
        });
    } else {
        console.error('Hamburger, navMenu, or sidebar not found');
    }
});

// Slideshow Variables
let slideIndex = 1;
let slideInterval;

// Function to show slides
function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (slides.length === 0 || dots.length === 0) {
        console.error("Slides or dots not found");
        return;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// Function to start the slideshow
function startSlideshow() {
    showSlides();
    slideInterval = setInterval(showSlides, 5000); // Change image every 5 seconds
}

// Function to show slides manually
function showSlidesManual(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// Function to pause the slideshow
function pauseSlideshow() {
    clearInterval(slideInterval);
}

// Event listeners for slide controls
function plusSlides(n) {
    clearInterval(slideInterval);
    showSlidesManual(slideIndex += n);
    slideInterval = setInterval(showSlides, 5000);
}

function currentSlide(n) {
    clearInterval(slideInterval);
    showSlidesManual(slideIndex = n);
    slideInterval = setInterval(showSlides, 5000);
}

// Initialize EmailJS and add event listener for the contact form
function initializeEmailJS() {
    emailjs.init("Y_-7u3Nz63nnM59C2"); // Replace with your actual EmailJS public key

    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const templateParams = {
            to_name: 'Hey Spencer', // Replace with your name or dynamic recipient name
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Send the main email to yourself
        emailjs.send('service_6btdcwd', 'template_ihddw7a', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Your message has been sent!');
                document.getElementById('contact-form').reset();
            }, function(error) {
                console.log('FAILED...', error);
                alert('Failed to send the message. Please try again.');
            });

        // Send the auto-reply to the user
        emailjs.send('service_6btdcwd', 'template_xx44i53', {
            from_name: templateParams.from_name,
            to_email: templateParams.from_email // Sending email to the user's email
        })
            .then(function(response) {
                console.log('Auto-reply sent!', response.status, response.text);
            }, function(error) {
                console.log('Auto-reply failed...', error);
            });
    });
}
