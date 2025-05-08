// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Éléments DOM
    const logo = document.getElementById('logo');
    const registerBtn = document.getElementById('register-btn');
    const printBtn = document.getElementById('print-btn');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const welcomeText = document.getElementById('welcome-text');
    const buttonsContainer = document.getElementById('buttons');
    
    // Animation du logo au démarrage
    setTimeout(() => {
        const logoAnimation = logo.animate([
            { transform: 'scale(0.5)', opacity: 0 },
            { transform: 'scale(1.2)', opacity: 1 },
            { transform: 'scale(1)', opacity: 1 }
        ], {
            duration: 1000,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }, 200);
    
    // Animation de pulse pour les boutons à intervalles réguliers
    setInterval(() => {
        registerBtn.classList.add('pulse-animation');
        setTimeout(() => {
            registerBtn.classList.remove('pulse-animation');
        }, 1000);
        
        setTimeout(() => {
            printBtn.classList.add('pulse-animation');
            setTimeout(() => {
                printBtn.classList.remove('pulse-animation');
            }, 1000);
        }, 1500);
    }, 5000);
    
    // Appliquer une animation de pulse CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .pulse-animation {
            animation: pulse 0.8s ease-in-out;
        }
    `;
    document.head.appendChild(style);
    
    // Effet parallaxe sur le mouvement de la souris
    document.addEventListener('mousemove', function(e) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        welcomeText.style.transform = `translateX(${xAxis}px) translateY(${yAxis}px)`;
        buttonsContainer.style.transform = `translateX(${xAxis * -1}px) translateY(${yAxis * -1}px)`;
    });
    
    // Animations lors du survol des boutons
    registerBtn.addEventListener('mouseover', function() {
        this.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0)' }
        ], {
            duration: 500,
            iterations: 1
        });
    });
    
    printBtn.addEventListener('mouseover', function() {
        this.animate([
            { transform: 'translateY(0)' },
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0)' }
        ], {
            duration: 500,
            iterations: 1
        });
    });
    
    // Animations lors du clic sur le logo
    logo.addEventListener('click', function() {
        this.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ], {
            duration: 800,
            iterations: 1
        });
        
        // Effet de confetti colorés
        createConfetti();
    });
    
    // Fonction pour créer l'effet de confetti
    function createConfetti() {
        const colors = ['#ff8800', '#ffa94d', '#ffcc80', '#e67700'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '100';
            confetti.style.top = '80px';
            confetti.style.left = '50%';
            document.body.appendChild(confetti);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            const destinationX = Math.cos(angle) * distance;
            const destinationY = Math.sin(angle) * distance + 100;
            
            confetti.animate([
                { transform: 'translate(-50%, -50%) scale(0)' },
                { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(1)` }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
                fill: 'forwards'
            }).onfinish = function() {
                confetti.animate([
                    { opacity: 1 },
                    { opacity: 0 }
                ], {
                    duration: 500,
                    fill: 'forwards'
                }).onfinish = function() {
                    confetti.remove();
                };
            };
        }
    }
    
    // Gestion des clics sur les boutons
    registerBtn.addEventListener('click', function() {
        showModal('Inscription', 'Veuillez remplir le formulaire d\'inscription pour créer un compte.');
        
        // Animation du bouton lors du clic
        this.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.9)' },
            { transform: 'scale(1)' }
        ], {
            duration: 300,
            iterations: 1
        });
    });
    
    printBtn.addEventListener('click', function() {
        showModal('Impression de reçu', 'Votre reçu est en cours d\'impression. Veuillez patienter un instant.');
        
        // Animation du bouton lors du clic
        this.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.9)' },
            { transform: 'scale(1)' }
        ], {
            duration: 300,
            iterations: 1
        });
        
        // Simuler une impression après 2 secondes
        setTimeout(() => {
            modalText.textContent = 'Votre reçu a été envoyé à l\'imprimante avec succès!';
        }, 2000);
    });
    
    // Fonction pour afficher la modal
    function showModal(title, text) {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modal.classList.add('active');
    }
    
    // Fermer la modal
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Fermer la modal en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Animation des sections du footer
    const footerSections = document.querySelectorAll('.footer-section');
    
    // Observer pour animer les sections du footer quand elles sont visibles
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    footerSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        footerObserver.observe(section);
    });
    
    // Effet de typewriter pour le titre de bienvenue
    const welcomeTitle = welcomeText.querySelector('h1');
    const originalText = welcomeTitle.textContent;
    welcomeTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            welcomeTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Démarrer l'effet après un délai
    setTimeout(typeWriter, 1200);
    
    // Easter egg : appuyer sur la touche 'o' fait tout devenir plus orange
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'o') {
            document.documentElement.style.setProperty('--primary-color', '#ff6600');
            document.documentElement.style.setProperty('--primary-light', '#ff8533');
            document.documentElement.style.setProperty('--primary-dark', '#cc5200');
            
            // Animation de flash orange
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.backgroundColor = 'rgba(255, 102, 0, 0.2)';
            flash.style.zIndex = '9999';
            flash.style.pointerEvents = 'none';
            document.body.appendChild(flash);
            
            flash.animate([
                { opacity: 0 },
                { opacity: 1 },
                { opacity: 0 }
            ], {
                duration: 1000,
                iterations: 1
            }).onfinish = function() {
                flash.remove();
            };
        }
    });
});