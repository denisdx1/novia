// Animaciones interactivas para la rosa y carta
document.addEventListener('DOMContentLoaded', function () {
    const rose = document.querySelector('.rose');
    const letter = document.getElementById('letter');
    const letterContent = document.querySelector('.letter-content');
    const closeButton = document.querySelector('.close-letter');
    const backgroundMusic = document.getElementById('background-music');
    const toggleMusicButton = document.getElementById('toggle-music');

    // Control de música
    let isMusicPlaying = true;
    
    // Asegurar que la música se cargue correctamente
    backgroundMusic.addEventListener('canplaythrough', function() {
        console.log('La música se ha cargado correctamente');
        // Ajustar el volumen para que no sea demasiado alto
        backgroundMusic.volume = 0.5; // 50% del volumen máximo
    });
    
    // Manejar errores de carga de música
    backgroundMusic.addEventListener('error', function() {
        console.error('Error al cargar la música');
        toggleMusicButton.textContent = '❌';
        toggleMusicButton.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    });
    
    toggleMusicButton.addEventListener('click', function() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            toggleMusicButton.textContent = '🔊';
        } else {
            backgroundMusic.play().catch(error => {
                console.error('Error al reproducir:', error);
                toggleMusicButton.textContent = '❌';
            });
            toggleMusicButton.textContent = '🔇';
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    // Efectos para la rosa
    rose.addEventListener('click', function () {
        createPetalParticles(rose);
        addSparkleEffect(rose);
    });

    // Efecto de respiración suave para la rosa
    rose.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
    });

    rose.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });

    // Funcionalidad de la carta
    letter.addEventListener('click', function () {
        // Efecto de apertura con sonido visual
        letter.style.transform = 'scale(0.9)';
        letter.style.transition = 'transform 0.1s ease';

        setTimeout(() => {
            letter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                letter.style.transform = 'scale(1)';
                openLetter();
            }, 100);
        }, 100);
    });

    function openLetter() {
        // Crear overlay con efecto de desenfoque
        const overlay = document.createElement('div');
        overlay.className = 'letter-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            z-index: 1001;
            opacity: 0;
            transition: all 0.4s ease;
        `;
        document.body.appendChild(overlay);

        // Desconectar la carta del contenedor original
        const letterContentParent = letterContent.parentNode;
        document.body.appendChild(letterContent);
        
        // Limpiar cualquier estilo inline que pueda interferir
        letterContent.style.cssText = '';
        
        // Asegurar que la carta esté centrada y visible
        letterContent.style.position = 'fixed';
        letterContent.style.top = '50%';
        letterContent.style.left = '50%';
        letterContent.style.transform = 'translate(-50%, -50%) scale(0) rotateY(90deg)';
        letterContent.style.display = 'block';
        letterContent.style.visibility = 'visible';
        letterContent.style.zIndex = '1002';
        letterContent.style.margin = '0';
        
        // Guardar referencia al padre original para restaurar después
        letterContent.originalParent = letterContentParent;
        
        setTimeout(() => {
            overlay.style.opacity = '1';
            letterContent.classList.add('open');
            letterContent.style.transform = 'translate(-50%, -50%) scale(1) rotateY(0deg)';
        }, 10);

        document.body.style.overflow = 'hidden';

        // Crear partículas de corazones
        setTimeout(() => {
            createHeartParticles();
        }, 300);

        // Agregar el overlay al contenido de la carta para poder cerrarlo
        letterContent.overlay = overlay;
    }

    // Función para crear partículas de corazones
    function createHeartParticles() {
        const hearts = ['💕', '💖', '💗', '💝', '❤️', '💘'];

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart-particle';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.left = Math.random() * window.innerWidth + 'px';
                heart.style.top = window.innerHeight + 'px';

                document.body.appendChild(heart);

                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 3000);
            }, i * 100);
        }
    }

    function closeLetter() {
        letterContent.classList.remove('open');
        // Aplicar la transformación de cierre
        letterContent.style.transform = 'translate(-50%, -50%) scale(0) rotateY(90deg)';

        if (letterContent.overlay) {
            letterContent.overlay.style.opacity = '0';
            setTimeout(() => {
                if (letterContent.overlay && letterContent.overlay.parentNode) {
                    letterContent.overlay.parentNode.removeChild(letterContent.overlay);
                }
                
                // Devolver la carta a su contenedor original si existe
                if (letterContent.originalParent) {
                    // Remover del body
                    if (letterContent.parentNode) {
                        letterContent.parentNode.removeChild(letterContent);
                    }
                    // Añadir de vuelta al contenedor original
                    letterContent.originalParent.appendChild(letterContent);
                }
                
                // Resetear completamente los estilos
                letterContent.style.cssText = '';
                letterContent.style.display = 'none';
                letterContent.style.visibility = 'hidden';
            }, 600);
        }

        document.body.style.overflow = 'auto';
    }

    closeButton.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLetter();
    });

    // Cerrar carta al hacer clic fuera
    letterContent.addEventListener('click', function (e) {
        if (e.target === letterContent) {
            closeLetter();
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && letterContent.classList.contains('open')) {
            closeLetter();
        }
    });

    // Función para crear partículas de pétalos
    function createPetalParticles(rose) {
        const rect = rose.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'petal-particle';
            particle.style.cssText = `
                position: fixed;
                width: 15px;
                height: 20px;
                background: radial-gradient(ellipse, #ff6b9d, #c44569);
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                pointer-events: none;
                z-index: 999;
                left: ${centerX}px;
                top: ${centerY}px;
            `;

            document.body.appendChild(particle);

            // Animar la partícula
            const angle = (i / 12) * Math.PI * 2;
            const distance = 120 + Math.random() * 80;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;

            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0) rotate(360deg)`,
                    opacity: 0
                }
            ], {
                duration: 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    // Función para agregar efecto de brillo
    function addSparkleEffect(rose) {
        rose.style.filter = 'brightness(1.3) saturate(1.2)';
        setTimeout(() => {
            rose.style.filter = 'brightness(1) saturate(1)';
        }, 500);
    }

    // Animación de viento suave
    function createWindEffect() {
        rose.style.transform = 'rotate(3deg)';
        rose.style.transition = 'transform 2s ease-in-out';

        setTimeout(() => {
            rose.style.transform = 'rotate(-2deg)';

            setTimeout(() => {
                rose.style.transform = 'rotate(0deg)';
            }, 1000);
        }, 1000);
    }

    // Ejecutar efecto de viento cada 8 segundos
    setInterval(createWindEffect, 8000);

    // Efecto de lluvia de pétalos ocasional
    function createPetalRain() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const petal = document.createElement('div');
                petal.className = 'falling-petal';
                petal.style.cssText = `
                    position: fixed;
                    width: 15px;
                    height: 20px;
                    background: radial-gradient(ellipse, #ff6b9d, #c44569);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    pointer-events: none;
                    z-index: 999;
                    left: ${Math.random() * window.innerWidth}px;
                    top: -20px;
                `;

                document.body.appendChild(petal);

                petal.animate([
                    {
                        transform: 'translateY(0) rotate(0deg)',
                        opacity: 1
                    },
                    {
                        transform: `translateY(${window.innerHeight + 50}px) rotate(360deg)`,
                        opacity: 0
                    }
                ], {
                    duration: 3000 + Math.random() * 2000,
                    easing: 'linear'
                }).onfinish = () => {
                    petal.remove();
                };
            }, i * 200);
        }
    }

    // Lluvia de pétalos cada 15 segundos
    setInterval(createPetalRain, 15000);

    // Cambio de colores gradual
    function changeRoseColors() {
        const colors = [
            ['#ff6b9d', '#c44569'],
            ['#ff9ff3', '#f368e0'],
            ['#feca57', '#ff9ff3'],
            ['#ff7675', '#d63031'],
            ['#a29bfe', '#6c5ce7']
        ];

        const petals = rose.querySelectorAll('.petal');
        const colorSet = colors[Math.floor(Math.random() * colors.length)];

        petals.forEach(petal => {
            petal.style.background = `radial-gradient(ellipse at center, ${colorSet[0]} 0%, ${colorSet[1]} 70%)`;
            petal.style.transition = 'background 3s ease-in-out';
        });
    }

    // Cambiar colores cada 15 segundos
    setInterval(changeRoseColors, 15000);
});