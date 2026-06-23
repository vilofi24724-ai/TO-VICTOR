// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initAOS();
    initQuiz();
    initParticles();
    initStars();
    initMusic();
    initConfetti();
    initCursorGlow();
    initScrollAnimations();
    initPetals();
    setCurrentDate();
    setTimeout(() => {
        document.querySelector('.loading-screen').style.display = 'none';
    }, 3000);
});

// ==================== AOS INITIALIZATION ====================
function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        disable: 'mobile'
    });
}

// ==================== QUIZ FUNCTIONALITY ====================
function initQuiz() {
    const quizForm = document.getElementById('quizForm');
    const textInput = document.querySelector('.text-input');
    const charCount = document.getElementById('charCount');

    if (textInput) {
        textInput.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    quizForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect answers
        const answers = {
    q1: document.querySelector('input[name="q1"]:checked').value,
    q2: document.querySelector('input[name="q2"]:checked').value,
    q3: document.querySelector('input[name="q3"]:checked').value,
    q4: textInput.value
};

try {
    await fetch(
        "https://script.google.com/macros/s/AKfycbx3wjdEvjW7Jivc-x6RF24OJo6qKAJ6q4OlmKA-bAJ-pCLbkQdbdwff9hleK_kH2vBHvQ/exec",
        {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(answers)
        }
    );
} catch(err) {
    console.log("Gagal menyimpan:", err);
}

        // Show success message
        const submitBtn = quizForm.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-heart"></i> Jawaban Diterima!';
        submitBtn.disabled = true;

        // Create confetti effect
        createConfetti();

        // Wait and transition
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Transition animation
        const quizSection = document.getElementById('quizSection');
        quizSection.style.opacity = '0';
        quizSection.style.transform = 'scale(0.95)';

        await new Promise(resolve => setTimeout(resolve, 600));

        // Show main content
        quizSection.style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';

        const bgMusic = document.getElementById('bgMusic');
        
        bgMusic.play().catch(err => console.log(err));
        
        document.body.style.overflow = 'auto';

        // Jalankan cerita galeri otomatis
       setTimeout(() => {
            startGalleryStory();
       }, 1500);

        // Refresh AOS
        setTimeout(() => AOS.refresh(), 100);
    });
}

// ==================== PARTICLES ====================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(232, 232, 232, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== STARS ====================
function initStars() {
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;

    const stars = starsContainer.querySelectorAll('.star');
    stars.forEach(star => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;

        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.animationDuration = duration + 's';
        star.style.animationDelay = delay + 's';
    });
}

// ==================== MUSIC CONTROL ====================
function initMusic() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');

    if (!musicBtn) return;

    musicBtn.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play().catch(error => {
                console.log('Audio play error:', error);
            });
            musicBtn.classList.add('playing');
        } else {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
        }
    });

    // Auto play when quiz is completed
    document.getElementById('quizForm').addEventListener('submit', () => {
        setTimeout(() => {
            bgMusic.play().catch(error => {
                console.log('Audio play error:', error);
            });
            musicBtn.classList.add('playing');
        }, 2000);
    });
}

// ==================== CONFETTI ====================
function createConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#c41e3a', '#e8e8e8', '#3a3a3a', '#ff6b8a'];

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 8 + 4;
            this.speedX = Math.random() * 8 - 4;
            this.speedY = Math.random() * 8 + 5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.3 - 0.15;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.speedY += 0.1; // Gravity
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
        confetti.push(new Confetti());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = confetti.length - 1; i >= 0; i--) {
            const c = confetti[i];
            c.update();

            if (c.y > canvas.height) {
                confetti.splice(i, 1);
            } else {
                c.draw();
            }
        }

        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function initConfetti() {
    // Confetti on page load after quiz
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', () => {
            createConfetti();
        });
    }
}

// ==================== CURSOR GLOW ====================
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;

    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = (e.clientX - 20) + 'px';
        cursorGlow.style.top = (e.clientY - 20) + 'px';
        cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', function() {
        cursorGlow.classList.remove('active');
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    // Smooth scroll for hero button
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            document.getElementById('gallerySection').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Gallery lightbox
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            showLightbox(this.src, this.alt);
        });
    });

    // Video play functionality
    const playBtn = document.getElementById('playBtn');
    const mainVideo = document.getElementById('mainVideo');
    if (playBtn && mainVideo) {
        playBtn.addEventListener('click', () => {
            if (mainVideo.paused) {
                mainVideo.play();
                playBtn.style.opacity = '0';
            } else {
                mainVideo.pause();
                playBtn.style.opacity = '1';
            }
        });

        mainVideo.addEventListener('play', () => {
            playBtn.style.opacity = '0';
        });

        mainVideo.addEventListener('pause', () => {
            playBtn.style.opacity = '1';
        });
    }

    // Letter envelope opening
    const letterEnvelope = document.querySelector('.envelope-front');
    const letterContent = document.querySelector('.letter-content');
    if (letterEnvelope && letterContent) {
        letterEnvelope.addEventListener('click', function() {
            this.classList.add('opened');
            letterContent.classList.add('show');
        });
    }
}

// ==================== PETALS EFFECT ====================
function initPetals() {
    const container = document.getElementById('rosePetalsContainer');
    if (!container) return;

    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 4 + 6) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(petal);

        setTimeout(() => petal.remove(), 10000);
    }

    // Create petals periodically
    setInterval(createPetal, 500);
}

// ==================== SET CURRENT DATE ====================
function setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (!dateElement) return;

    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = today.toLocaleDateString('id-ID', options);
    dateElement.textContent = formattedDate;
}

// ==================== GSAP ANIMATIONS ====================
gsap.registerPlugin(ScrollTrigger);

// Title animation
gsap.fromTo('.hero-title', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, delay: 0.5 }
);

// Subtitle animation
gsap.fromTo('.hero-subtitle',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, delay: 0.8 }
);

// ==================== LIGHTBOX ====================
function showLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 0 50px rgba(196, 30, 60, 0.5);
        animation: zoomIn 0.3s ease-out;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: rgba(196, 30, 60, 0.9);
        border: none;
        color: white;
        font-size: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10001;
    `;

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'var(--accent-color)';
        closeBtn.style.transform = 'scale(1.1)';
    });

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(196, 30, 60, 0.9)';
        closeBtn.style.transform = 'scale(1)';
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.opacity = '0';
        setTimeout(() => lightbox.remove(), 300);
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.opacity = '0';
            setTimeout(() => this.remove(), 300);
        }
    });

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    // Add fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes zoomIn {
            from { 
                opacity: 0;
                transform: scale(0.8);
            }
            to { 
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== GALLERY STORY ====================

async function startGalleryStory() {

    console.log("Gallery Story Dimulai");

    const galleryItems =
        document.querySelectorAll('.gallery-item');

    console.log("Jumlah foto:", galleryItems.length);

    document
        .getElementById('gallerySection')
        .scrollIntoView({
            behavior: 'smooth'
        });

    for(let i = 0; i < galleryItems.length; i++) {

        console.log("Foto tampil:", i + 1);

        galleryItems[i]
            .classList.add('story-show');

        await new Promise(resolve =>
            setTimeout(resolve, 4000)
        );
    }

    console.log("Pindah ke video");

    await new Promise(resolve =>
        setTimeout(resolve, 1000)
    );

    document
        .getElementById('videoSection')
        .scrollIntoView({
            behavior: 'smooth'
        });

    const video =
        document.getElementById('mainVideo');

    if(video){
        video.play().catch(err => console.log(err));
    }
}

// ==================== RESPONSIVE ====================
window.addEventListener('resize', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});