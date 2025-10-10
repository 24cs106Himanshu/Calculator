// Birthday Website Interactive Features

// Global variables
let musicPlaying = false;
let candlesBlown = 0;
const totalCandles = 3;

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    createFloatingElements();
    setupScrollAnimations();
    addPhotoUploadFeature();
    createMoreConfetti();
});

// Initialize entrance animations
function initializeAnimations() {
    // Stagger animation for photo slots
    const photoSlots = document.querySelectorAll('.photo-slot');
    photoSlots.forEach((slot, index) => {
        slot.style.animationDelay = `${index * 0.2}s`;
    });

    // Stagger animation for message cards
    const messageCards = document.querySelectorAll('.message-card');
    messageCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.3}s`;
    });
}

// Create additional floating elements
function createFloatingElements() {
    // Create more floating hearts
    for (let i = 0; i < 5; i++) {
        createFloatingHeart();
    }

    // Create floating sparkles
    for (let i = 0; i < 8; i++) {
        createFloatingSparkle();
    }
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = Math.random() > 0.5 ? '💖' : '💕';
    heart.style.position = 'fixed';
    heart.style.fontSize = Math.random() * 10 + 15 + 'px';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '100%';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1';
    heart.style.opacity = '0.7';
    
    document.body.appendChild(heart);
    
    // Animate the heart
    const duration = Math.random() * 3000 + 4000;
    heart.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 0.7 },
        { transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-out'
    }).onfinish = () => {
        heart.remove();
        // Create a new one
        setTimeout(createFloatingHeart, Math.random() * 2000);
    };
}

function createFloatingSparkle() {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.fontSize = Math.random() * 8 + 12 + 'px';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1';
    
    document.body.appendChild(sparkle);
    
    // Animate the sparkle
    sparkle.animate([
        { opacity: 0, transform: 'scale(0) rotate(0deg)' },
        { opacity: 1, transform: 'scale(1) rotate(180deg)' },
        { opacity: 0, transform: 'scale(0) rotate(360deg)' }
    ], {
        duration: 2000,
        easing: 'ease-in-out'
    }).onfinish = () => {
        sparkle.remove();
        // Create a new one
        setTimeout(createFloatingSparkle, Math.random() * 3000);
    };
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const elementsToAnimate = document.querySelectorAll('.photo-slot, .message-card');
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Candle blowing functionality
function blowCandle(candle) {
    if (!candle.classList.contains('blown-out')) {
        candle.classList.add('blown-out');
        candlesBlown++;
        
        // Create smoke effect
        createSmokeEffect(candle);
        
        // Play blow sound effect (if you add audio)
        playBlowSound();
        
        // Check if all candles are blown out
        if (candlesBlown === totalCandles) {
            showWishMessage();
            createWishFireworks();
        }
    }
}

function createSmokeEffect(candle) {
    const smoke = document.createElement('div');
    smoke.innerHTML = '💨';
    smoke.style.position = 'absolute';
    smoke.style.fontSize = '20px';
    smoke.style.opacity = '0.8';
    smoke.style.pointerEvents = 'none';
    
    const rect = candle.getBoundingClientRect();
    smoke.style.left = rect.left + rect.width / 2 + 'px';
    smoke.style.top = rect.top + 'px';
    smoke.style.position = 'fixed';
    smoke.style.zIndex = '1000';
    
    document.body.appendChild(smoke);
    
    // Animate smoke
    smoke.animate([
        { transform: 'translateY(0px) scale(0.5)', opacity: 0.8 },
        { transform: 'translateY(-50px) scale(1.5)', opacity: 0 }
    ], {
        duration: 1500,
        easing: 'ease-out'
    }).onfinish = () => smoke.remove();
}

function playBlowSound() {
    // Create a simple audio context for a blow sound effect
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function showWishMessage() {
    const wishMessage = document.querySelector('.wish-message');
    wishMessage.classList.remove('hidden');
    
    // Add extra celebration
    document.body.style.animation = 'celebrate 2s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

function createWishFireworks() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 200);
    }
}

function createFirework() {
    const firework = document.createElement('div');
    firework.innerHTML = '🎆';
    firework.style.position = 'fixed';
    firework.style.fontSize = '30px';
    firework.style.left = Math.random() * 100 + '%';
    firework.style.top = Math.random() * 50 + 25 + '%';
    firework.style.pointerEvents = 'none';
    firework.style.zIndex = '1000';
    
    document.body.appendChild(firework);
    
    firework.animate([
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(1.5)' },
        { opacity: 0, transform: 'scale(0)' }
    ], {
        duration: 1000,
        easing: 'ease-out'
    }).onfinish = () => firework.remove();
}

// Music control functionality
function toggleMusic() {
    const musicBtn = document.getElementById('musicBtn');
    const music = document.getElementById('birthdayMusic');
    
    if (!musicPlaying) {
        // Since we don't have an actual audio file, we'll create a visual indication
        musicBtn.textContent = '🎵 Music Playing';
        musicBtn.classList.add('playing');
        musicPlaying = true;
        
        // Create musical notes animation
        createMusicalNotes();
    } else {
        musicBtn.textContent = '🎵 Play Birthday Song';
        musicBtn.classList.remove('playing');
        musicPlaying = false;
    }
}

function createMusicalNotes() {
    if (!musicPlaying) return;
    
    const notes = ['🎵', '🎶', '♪', '♫'];
    const note = document.createElement('div');
    note.innerHTML = notes[Math.floor(Math.random() * notes.length)];
    note.style.position = 'fixed';
    note.style.fontSize = '20px';
    note.style.right = '80px';
    note.style.bottom = '80px';
    note.style.pointerEvents = 'none';
    note.style.zIndex = '999';
    note.style.color = '#667eea';
    
    document.body.appendChild(note);
    
    note.animate([
        { opacity: 1, transform: 'translateY(0px) scale(1)' },
        { opacity: 0, transform: 'translateY(-100px) scale(1.5)' }
    ], {
        duration: 2000,
        easing: 'ease-out'
    }).onfinish = () => note.remove();
    
    // Continue creating notes while music is playing
    if (musicPlaying) {
        setTimeout(createMusicalNotes, 500);
    }
}

// Photo upload functionality
function addPhotoUploadFeature() {
    const photoSlots = document.querySelectorAll('.photo-placeholder');
    
    photoSlots.forEach(placeholder => {
        // Add click event for photo upload
        placeholder.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // Replace placeholder with image
                        placeholder.innerHTML = `<img src="${e.target.result}" alt="Mom's photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">`;
                        placeholder.style.border = 'none';
                        placeholder.style.background = 'none';
                        
                        // Add celebration effect
                        createPhotoUploadCelebration(placeholder);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });
        
        // Add hover effect instructions
        placeholder.addEventListener('mouseenter', function() {
            if (!this.querySelector('img')) {
                this.style.cursor = 'pointer';
                const instruction = document.createElement('div');
                instruction.innerHTML = '📷 Click to add photo';
                instruction.style.position = 'absolute';
                instruction.style.bottom = '10px';
                instruction.style.left = '50%';
                instruction.style.transform = 'translateX(-50%)';
                instruction.style.fontSize = '0.8rem';
                instruction.style.color = '#007bff';
                instruction.style.fontWeight = 'bold';
                instruction.className = 'upload-instruction';
                this.appendChild(instruction);
            }
        });
        
        placeholder.addEventListener('mouseleave', function() {
            const instruction = this.querySelector('.upload-instruction');
            if (instruction) {
                instruction.remove();
            }
        });
    });
}

function createPhotoUploadCelebration(element) {
    // Create celebration particles
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '⭐';
        particle.style.position = 'absolute';
        particle.style.fontSize = '20px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.position = 'fixed';
        
        document.body.appendChild(particle);
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Create more confetti effects
function createMoreConfetti() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            createConfettiPiece();
        }
    }, 2000);
}

function createConfettiPiece() {
    const confettiEmojis = ['🎉', '🎊', '🎈', '🌟', '💖', '🎂'];
    const confetti = document.createElement('div');
    confetti.innerHTML = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
    confetti.style.position = 'fixed';
    confetti.style.fontSize = Math.random() * 10 + 15 + 'px';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-50px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1';
    
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 2000 + 3000;
    const rotation = Math.random() * 720 - 360;
    
    confetti.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    }).onfinish = () => confetti.remove();
}

// Add celebration CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrate {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.02); }
        50% { transform: scale(1); }
        75% { transform: scale(1.02); }
    }
    
    .photo-placeholder img {
        transition: all 0.3s ease;
    }
    
    .photo-placeholder:hover img {
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Add some interactive message card effects
document.addEventListener('DOMContentLoaded', function() {
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach(card => {
        card.addEventListener('click', function() {
            // Create heart burst effect
            createHeartBurst(this);
        });
    });
});

function createHeartBurst(element) {
    const hearts = ['💖', '💕', '💗', '💓'];
    
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        heart.style.left = rect.left + rect.width / 2 + 'px';
        heart.style.top = rect.top + rect.height / 2 + 'px';
        heart.style.position = 'fixed';
        
        document.body.appendChild(heart);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 80;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        heart.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => heart.remove();
    }
}