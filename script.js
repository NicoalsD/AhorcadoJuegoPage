// ===== VARIABLES GLOBALES =====
let isMenuOpen = false;
let currentSection = 'inicio';

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeCopyButtons();
    initializeAnimations();
    setupScrollSpy();
});

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar menú al hacer click en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMobileMenu();
            handleSmoothScroll(e);
        });
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    isMenuOpen = !isMenuOpen;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (isMenuOpen) {
        isMenuOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function handleSmoothScroll(e) {
    const targetId = e.currentTarget.getAttribute('href'); // Cambiado a e.currentTarget

    // Solo prevenir el comportamiento por defecto y hacer scroll suave
    // si el enlace es interno (comienza con #)
    if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Altura del navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Actualizar URL sin recargar
            history.pushState(null, null, targetId);
        }
    }
    // Si no es un enlace interno (ej. un enlace a GitHub),
    // no se llama a e.preventDefault() y el navegador seguirá el enlace normalmente.
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        handleNavbarScroll(navbar);
        handleScrollAnimations();
    });
}

function handleNavbarScroll(navbar) {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animated');
        }
    });
}

// ===== SCROLL SPY =====
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Actualizar navegación activa
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        
        currentSection = currentSectionId;
    });
}

// ===== BOTONES DE COPIA =====
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const codeElement = e.target.closest('.class-card').querySelector('.code-section pre code');
            
            if (codeElement) {
                try {
                    await navigator.clipboard.writeText(codeElement.textContent);
                    
                    // Feedback visual
                    const originalText = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i> Copiado';
                    button.style.background = '#10b981';
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = '';
                    }, 2000);
                    
                } catch (err) {
                    console.error('Error al copiar al portapapeles:', err);
                    
                    // Fallback para navegadores más antiguos
                    fallbackCopyTextToClipboard(codeElement.textContent, button);
                }
            }
        });
    });
}

function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copiado';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback: No se pudo copiar el texto:', err);
    }
    
    document.body.removeChild(textArea);
}

// ===== ANIMACIONES =====
function initializeAnimations() {
    // Agregar clase de animación a elementos relevantes
    const animatedElements = document.querySelectorAll(
        '.context-card, .team-member, .class-card, .demo-item, .requirements-table'
    );
    
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Efecto de typing para el código del hero
    const codeElement = document.querySelector('.code-content code');
    if (codeElement) {
        typeCode(codeElement);
    }
    
    // Animación de estadísticas
    animateStats();
}

function typeCode(element) {
    const originalText = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const speed = 30; // milliseconds
    
    function typeWriter() {
        if (i < originalText.length) {
            element.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    // Iniciar después de un pequeño delay
    setTimeout(typeWriter, 1000);
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const text = stat.textContent;
                
                // Solo animar números
                if (!isNaN(text)) {
                    animateNumber(stat, 0, parseInt(text), 2000);
                } else {
                    // Para texto como "Python" o "POO", solo agregar efecto fade
                    stat.style.opacity = '0';
                    stat.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        stat.style.transition = 'all 0.3s ease';
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0)';
                    }, 300);
                }
                
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// ===== EFECTOS INTERACTIVOS =====
function initializeInteractiveEffects() {
    // Efecto hover mejorado para las tarjetas
    const cards = document.querySelectorAll('.context-card, .team-member, .demo-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// ===== UTILIDADES =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func(...args);
    };
}

// ===== MANEJO DE ERRORES =====
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('Error en la aplicación:', e.error);
    });
    
    // Verificar soporte de características
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver no es compatible con este navegador');
        // Fallback para navegadores más antiguos
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animated');
        });
    }
    
    if (!navigator.clipboard) {
        console.warn('Clipboard API no disponible, usando fallback');
    }
}

// ===== INICIALIZACIÓN COMPLETA =====
// ===== INICIALIZACIÓN COMPLETA =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeNavigation();
        initializeScrollEffects();
        initializeCopyButtons();
        initializeAnimations();
        initializeInteractiveEffects();
        setupScrollSpy();
        handleErrors();

        // Inicializar Mermaid
        if (typeof mermaid !== 'undefined') {
            // Obtener valores de las variables CSS para usarlos en Mermaid
            // Necesitamos obtener el estilo computado del :root o body para acceder a las variables CSS
            const rootStyles = getComputedStyle(document.documentElement);

            mermaid.initialize({
                startOnLoad: true,
                theme: 'base', // 'base' permite más personalización con themeVariables
                themeVariables: {
                    // Colores de tu :root en styles.css
                    primaryColor: rootStyles.getPropertyValue('--primary-color').trim() || '#2563eb',
                    primaryTextColor: rootStyles.getPropertyValue('--dark-color').trim() || '#1f2937',
                    primaryBorderColor: rootStyles.getPropertyValue('--primary-color').trim() || '#2563eb',
                    lineColor: rootStyles.getPropertyValue('--gray-700').trim() || '#334155',
                    textColor: rootStyles.getPropertyValue('--dark-color').trim() || '#1f2937',
                    
                    // Variables específicas para diagramas de clases (pueden variar según la versión de Mermaid)
                    classText: rootStyles.getPropertyValue('--dark-color').trim() || '#1f2937',
                    // Backgrounds
                    mainBkg: rootStyles.getPropertyValue('--light-color').trim() || '#f8fafc', // Fondo principal del diagrama
                    clusterBkg: rootStyles.getPropertyValue('--gray-100').trim() || '#f1f5f9', // Fondo de las cajas de clase

                    // Font
                    fontFamily: rootStyles.getPropertyValue('--font-family').trim() || 'Inter, sans-serif',
                    fontSize: '18px', // Mermaid suele usar px. Puedes ajustar esto.

                    // Relaciones
                    relationColor: rootStyles.getPropertyValue('--gray-600').trim() || '#475569',
                    relationLabelColor: rootStyles.getPropertyValue('--dark-color').trim() || '#1f2937',
                    arrowheadColor: rootStyles.getPropertyValue('--gray-700').trim() || '#334155'
                }
            });
            // Forzar un re-renderizado si es necesario después de cargar estilos
            // mermaid.contentLoaded(); // Descomentar si el diagrama no aparece inicialmente
        }
        
        console.log('Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
});

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
// Throttle para eventos de scroll
const throttledScroll = debounce(() => {
    handleScrollAnimations();
}, 100);

window.addEventListener('scroll', throttledScroll);

// Limpieza de memoria al cerrar la página
window.addEventListener('beforeunload', () => {
    // Limpiar timers y event listeners si es necesario
    document.body.style.overflow = 'auto';
});