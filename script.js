document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let slideInterval;

    function nextSlide() {
        // Marcar el slide actual como "prev" antes de cambiar
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('prev');
        
        // Calcular el siguiente slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Activar el nuevo slide
        slides[currentSlide].classList.add('active');
        slides[currentSlide].classList.remove('prev');
        
        // Eliminar la clase "prev" del slide anterior después de la transición
        setTimeout(() => {
            const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
            slides[prevSlide].classList.remove('prev');
        }, 1000);
    }

    function startSlider() {
        // Inicializar el primer slide
        slides[0].classList.add('active');
        
        // Iniciar el intervalo
        slideInterval = setInterval(nextSlide, 5000);
    }

    startSlider();
});

document.querySelectorAll('.social-links a').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Activa la animación un poco antes
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible'); // Reset para volver a animar
        }
    });
}, observerOptions);

// Observar todas las secciones
document.querySelectorAll('.seccion').forEach(section => {
    observer.observe(section);
    // Añadir esto para asegurar que se vean las secciones iniciales
    if (section.getBoundingClientRect().top < window.innerHeight * 0.8) {
        section.classList.add('visible');
    }
});

document.querySelectorAll('.btn-vermas').forEach(button => {
    button.addEventListener('click', (e) => {
        const seccion = e.currentTarget.closest('.seccion');
        const textoCompleto = seccion.querySelector('.texto-completo');
        const textoCorto = seccion.querySelector('.texto-corto');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            // Collapse
            textoCompleto.classList.remove('visible');
            textoCorto.classList.remove('oculto');
            button.setAttribute('aria-expanded', 'false');
        } else {
            // Expand - primero calcula altura real
            textoCompleto.style.display = 'block'; // Temporal para medir
            const alturaReal = textoCompleto.scrollHeight + 'px';
            textoCompleto.style.display = '';
            
            // altura dinámica
            textoCompleto.style.setProperty('--max-height-dinamico', alturaReal);
            
            // Activa la animación
            textoCorto.classList.add('oculto');
            textoCompleto.classList.add('visible');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const contactoBtn = document.getElementById('contactoBtn');
    
    if (contactoBtn) {
        contactoBtn.addEventListener('click', function(e) {
            // Detectar si es móvil/tablet
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
            
            // Solo redirigir a Gmail web en desktop
            if (!isMobile) {
                e.preventDefault();
                
                // Extraer parámetros del mailto: existente
                const mailtoLink = contactoBtn.href;
                const [_, email, params] = mailtoLink.match(/mailto:([^\?]+)\?(.+)/) || [];
                const urlParams = new URLSearchParams(params);
                
                // Construir URL de Gmail
                const gmailUrl = new URL('https://mail.google.com/mail/');
                gmailUrl.searchParams.set('view', 'cm');
                gmailUrl.searchParams.set('fs', '1');
                gmailUrl.searchParams.set('to', email || 'legadogimnasista@gmail.com');
                gmailUrl.searchParams.set('su', urlParams.get('subject') || 'Consulta desde la web');
                gmailUrl.searchParams.set('body', urlParams.get('body') || 'Hola, me gustaría recibir información sobre...');
                
                window.open(gmailUrl.toString(), '_blank');
            }
            // En móviles se mantiene el mailto
        });
    }
});

// Carrusel de actividades mejorado
function initActividadesCarousel() {
    const slides = document.querySelectorAll('.slide-actividad');
    const indicatorsContainer = document.querySelector('.indicadores-actividades');
    const prevBtn = document.querySelector('.carrusel-actividades .anterior');
    const nextBtn = document.querySelector('.carrusel-actividades .siguiente');
    let currentIndex = 0;
    let interval;
    const slideInterval = 5000; // 5 segundos

    // Crear indicadores dinámicamente
    slides.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.className = 'indicador';
        indicator.dataset.index = index;
        indicator.setAttribute('aria-label', `Ir a slide ${index + 1}`);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.indicador');

    // Mostrar slide específico
    function showSlide(index) {
        // Asegurarse que el índice esté dentro de los límites
        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }

        // Ocultar todos los slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true');
        });
        
        // Ocultar todos los indicadores
        indicators.forEach(ind => ind.classList.remove('active'));
        
        // Mostrar slide actual
        slides[currentIndex].classList.add('active');
        slides[currentIndex].setAttribute('aria-hidden', 'false');
        
        // Actualizar indicador
        indicators[currentIndex].classList.add('active');
    }

    // Ir a slide específico
    function goToSlide(index) {
        showSlide(index);
        resetInterval();
    }

    // Slide siguiente
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Slide anterior
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Reiniciar intervalo
    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, slideInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        }
    });

    // Pausar al interactuar
    const container = document.querySelector('.carrusel-container');
    if (container) {
        container.addEventListener('mouseenter', () => clearInterval(interval));
        container.addEventListener('mouseleave', resetInterval);
        container.addEventListener('focusin', () => clearInterval(interval));
        container.addEventListener('focusout', resetInterval);
    }

    // Inicializar
    showSlide(0);
    resetInterval();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initActividadesCarousel);