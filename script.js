document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Enter Overlay & Audio Logic
    const enterBtn = document.getElementById('enter-btn');
    const enterOverlay = document.getElementById('enter-overlay');
    const bgMusic = document.getElementById('bg-music');
    const audioToggle = document.getElementById('audio-toggle');
    const iconOn = document.getElementById('audio-icon-on');
    const iconOff = document.getElementById('audio-icon-off');
    
    let isPlaying = false;

    const enterWedding = (e) => {
        if (e) e.preventDefault();
        // 1. Immediately hide overlay & unlock scroll
        enterOverlay.classList.add('hidden');
        enterOverlay.style.opacity = '0';
        enterOverlay.style.pointerEvents = 'none';
        setTimeout(() => { enterOverlay.style.display = 'none'; }, 400);
        document.body.classList.remove('locked');
        audioToggle.classList.add('visible');
        
        // 2. Play audio safely
        if (bgMusic) {
            bgMusic.volume = 0.4;
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    if (iconOn) iconOn.style.display = 'block';
                    if (iconOff) iconOff.style.display = 'none';
                }).catch(err => {
                    console.log("Audio play failed/deferred:", err);
                    isPlaying = false;
                    if (iconOn) iconOn.style.display = 'none';
                    if (iconOff) iconOff.style.display = 'block';
                });
            }
        }
        
        // 3. Trigger initial scroll reveals
        setTimeout(triggerReveals, 300);
    };

    if (enterBtn) {
        enterBtn.addEventListener('click', enterWedding);
        enterBtn.addEventListener('touchend', enterWedding, { passive: false });
    }

    audioToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            iconOn.style.display = 'none';
            iconOff.style.display = 'block';
        } else {
            bgMusic.play();
            iconOn.style.display = 'block';
            iconOff.style.display = 'none';
        }
        isPlaying = !isPlaying;
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. MotionSites Scroll Reveal Animations
    const revealSelectors = ['.reveal-mask', '.reveal-fade', '.reveal-slide-up', '.reveal-slide-right', '.reveal-scale-up'];
    const reveals = document.querySelectorAll(revealSelectors.join(', '));
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    function triggerReveals() {
        reveals.forEach(reveal => {
            revealOnScroll.observe(reveal);
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < window.innerHeight) {
                reveal.classList.add('active');
            }
        });
    }

    // 4. Global Background Crossfade Logic
    const bgLayers = [
        document.getElementById('bg-layer-1'),
        document.getElementById('bg-layer-2'),
        document.getElementById('bg-layer-3'),
        document.getElementById('bg-layer-4')
    ];
    
    const eventsSec = document.getElementById('events');
    const gallerySec = document.getElementById('gallery');
    const rsvpSec = document.getElementById('rsvp');
    
    window.addEventListener('scroll', () => {
        let activeIndex = 0;
        
        // When RSVP comes into the bottom 40% of the screen, show Layer 4
        if (rsvpSec.getBoundingClientRect().top < window.innerHeight * 0.6) {
            activeIndex = 3; // RSVP -> Radha Krishna.jpg
        }
        // When Gallery comes into the bottom 40% of the screen, show Layer 3
        else if (gallerySec.getBoundingClientRect().top < window.innerHeight * 0.6) {
            activeIndex = 2; // Gallery -> Radhakrishn.jpg
        } 
        // When Events comes into the bottom 40% of the screen, show Layer 2
        else if (eventsSec.getBoundingClientRect().top < window.innerHeight * 0.6) {
            activeIndex = 1; // Events -> Flute.jpg
        } 
        // Otherwise show Layer 1
        else {
            activeIndex = 0; // Home & Subhalekha -> bg1.jpg
        }
        
        bgLayers.forEach((layer, index) => {
            if (index === activeIndex) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });
    });


    // 6. Countdown Timer
    const weddingDate = new Date('August 27, 2026 11:06:00').getTime();
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) return;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    };
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 7. RSVP Form
    document.getElementById('rsvpForm').addEventListener('submit', (e) => {
        e.preventDefault();
        e.target.reset();
    });

    // 8. Lightbox Modal Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Click Photo
    document.querySelectorAll('.photo-item:not(.video-item) img').forEach(img => {
        img.addEventListener('click', () => {
            if (lightbox) {
                if (lightboxVideo) { lightboxVideo.style.display = 'none'; lightboxVideo.pause(); }
                if (lightboxImg) { lightboxImg.src = img.src; lightboxImg.style.display = 'block'; }
                lightbox.classList.add('active');
            }
        });
    });

    // Click Video
    document.querySelectorAll('.photo-item.video-item').forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-video');
            if (lightbox && videoSrc) {
                if (lightboxImg) lightboxImg.style.display = 'none';
                if (lightboxVideo) {
                    lightboxVideo.src = videoSrc;
                    lightboxVideo.style.display = 'block';
                    lightboxVideo.play();
                }
                lightbox.classList.add('active');
            }
        });
    });

    const closeLightbox = () => {
        if (lightbox) lightbox.classList.remove('active');
        if (lightboxVideo) { lightboxVideo.pause(); lightboxVideo.src = ''; }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    // 9. Falling Petals Generator
    const petalsContainer = document.getElementById('petals-container');
    if (petalsContainer) {
        for (let i = 0; i < 22; i++) {
            const petal = document.createElement('div');
            petal.className = Math.random() > 0.4 ? 'petal' : 'petal rose';
            const size = Math.random() * 14 + 10;
            petal.style.width = `${size}px`;
            petal.style.height = `${size * 1.4}px`;
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.animationDuration = `${Math.random() * 6 + 7}s`;
            petal.style.animationDelay = `${Math.random() * 5}s`;
            petalsContainer.appendChild(petal);
        }
    }

    // 10. Golden Cursor Sparkle Effect (Vivid Stardust)
    let lastSparkleTime = 0;
    const createSparkle = (x, y) => {
        const now = Date.now();
        if (now - lastSparkleTime < 20) return; // Responsive 20ms
        lastSparkleTime = now;

        // Spawn 2 sparkling particles per movement
        for (let i = 0; i < 2; i++) {
            const sparkle = document.createElement('div');
            const isStar = Math.random() > 0.35;
            sparkle.className = isStar ? 'cursor-sparkle' : 'cursor-sparkle dot';

            const offsetX = (Math.random() - 0.5) * 16;
            const offsetY = (Math.random() - 0.5) * 16;
            const driftX = (Math.random() - 0.5) * 45;
            const driftY = (Math.random() * 35) + 10;

            sparkle.style.left = `${x + offsetX}px`;
            sparkle.style.top = `${y + offsetY}px`;
            sparkle.style.setProperty('--tx', `${driftX}px`);
            sparkle.style.setProperty('--ty', `${driftY}px`);

            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 900);
        }
    };

    window.addEventListener('mousemove', (e) => createSparkle(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) createSparkle(e.touches[0].clientX, e.touches[0].clientY);
    });

    // 11. WhatsApp Share Link Setup
    const whatsappBtn = document.getElementById('whatsapp-share');
    if (whatsappBtn) {
        const siteUrl = window.location.href.split('#')[0];
        const shareMsg = encodeURIComponent(
            `🌸 *Adbhutha & Vamsi Wedding Invitation (#VAADA)* 🌸\n\n` +
            `Cordially inviting you with family & friends to grace the marriage celebrations of Adbhutha & Vamsi on August 27th, 2026 at Annavaram Up Hills!\n\n` +
            `✨ View Wedding Website & Complete Details:\n${siteUrl}`
        );
        whatsappBtn.href = `https://api.whatsapp.com/send?text=${shareMsg}`;
    }
});

// 8. Language Switcher for Subhalekha
function switchLanguage(lang) {
    const cardEn = document.getElementById('subhalekha-en');
    const cardTe = document.getElementById('subhalekha-te');
    const tabEn = document.getElementById('tab-en');
    const tabTe = document.getElementById('tab-te');

    if (lang === 'en') {
        if (cardEn) cardEn.style.display = 'block';
        if (cardTe) cardTe.style.display = 'none';
        if (tabEn) tabEn.classList.add('active');
        if (tabTe) tabTe.classList.remove('active');
    } else {
        if (cardEn) cardEn.style.display = 'none';
        if (cardTe) cardTe.style.display = 'block';
        if (tabTe) tabTe.classList.add('active');
        if (tabEn) tabEn.classList.remove('active');
    }
}
