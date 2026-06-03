// main.js

document.addEventListener('DOMContentLoaded', () => {
    
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarCloseBtn = document.querySelector('.sidebar__close-btn');
    const isMobile = () => window.innerWidth <= 1156;
    
    // ===== ФУНКЦИИ УПРАВЛЕНИЯ САЙДБАРОМ =====
    function openSidebar() {
        sidebar.classList.remove('is-closed');
        if (isMobile()) {
            sidebar.classList.add('is-open-mobile');
        }
        localStorage.setItem('brandbook-sidebar', 'open');
    }
    
    function closeSidebar() {
        sidebar.classList.add('is-closed');
        if (isMobile()) {
            sidebar.classList.remove('is-open-mobile');
        }
        localStorage.setItem('brandbook-sidebar', 'closed');
    }
    
    function toggleSidebar() {
        if (isMobile()) {
            if (sidebar.classList.contains('is-open-mobile')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        } else {
            if (sidebar.classList.contains('is-closed')) {
                openSidebar();
            } else {
                closeSidebar();
            }
        }
    }
    
    // ===== ЗАГРУЗКА СОСТОЯНИЯ =====
    const savedState = localStorage.getItem('brandbook-sidebar');
    if (savedState === 'closed') {
        closeSidebar();
    } else {
        openSidebar();
    }
    
    // ===== СОБЫТИЯ КНОПОК =====
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }
    
    // ===== ЗАКРЫТИЕ ПРИ КЛИКЕ ВНЕ (только мобилка) =====
    document.addEventListener('click', (e) => {
        if (isMobile() && sidebar.classList.contains('is-open-mobile')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                closeSidebar();
            }
        }
    });
    
    // ===== ПЛАВНОСТЬ ПРИ РЕСАЙЗЕ =====
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            if (sidebar.classList.contains('is-open-mobile')) {
                sidebar.classList.remove('is-open-mobile');
            }
            const saved = localStorage.getItem('brandbook-sidebar');
            if (saved === 'closed') {
                sidebar.classList.add('is-closed');
            } else {
                sidebar.classList.remove('is-closed');
            }
        } else {
            sidebar.classList.remove('is-closed');
            const saved = localStorage.getItem('brandbook-sidebar');
            if (saved === 'open') {
                sidebar.classList.add('is-open-mobile');
            } else {
                sidebar.classList.remove('is-open-mobile');
            }
        }
    });
    
    // ===== АКТИВНЫЙ ПУНКТ МЕНЮ (ПОДРАЗДЕЛЫ) =====
    const sections = document.querySelectorAll('section[id], div[id]');
    const navItems = document.querySelectorAll('.sidebar__nav-item');
    const subnavItems = document.querySelectorAll('.sidebar__subnav-item');
    
    function setActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => item.classList.remove('active'));
        subnavItems.forEach(item => item.classList.remove('active'));
        
        if (currentSection) {
            navItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href === `#${currentSection}`) {
                    item.classList.add('active');
                }
            });
            
            subnavItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href === `#${currentSection}`) {
                    item.classList.add('active');
                }
            });
        }
    }
    
    // ===== АКТИВНЫЕ РАЗДЕЛЫ В МЕНЮ (Концепция / Визуал) =====
    function setActiveSection() {
        const scrollPosition = window.scrollY + 150;
        
        const conceptSection = document.querySelector('#concept');
        const visualSection = document.querySelector('#visual');
        
        const conceptContainer = document.querySelector('.sidebar__section--concept');
        const visualContainer = document.querySelector('.sidebar__section--visual');
        const conceptTitle = document.querySelector('#concept-link');
        const visualTitle = document.querySelector('#visual-link');
        
        if (!conceptSection || !visualSection) return;
        
        const conceptTop = conceptSection.offsetTop;
        const visualTop = visualSection.offsetTop;
        
        // Активный раздел
        if (scrollPosition >= conceptTop && scrollPosition < visualTop) {
            conceptTitle?.classList.add('active');
            visualTitle?.classList.remove('active');
            conceptContainer?.classList.add('active');
            visualContainer?.classList.remove('active');
        } else if (scrollPosition >= visualTop) {
            visualTitle?.classList.add('active');
            conceptTitle?.classList.remove('active');
            visualContainer?.classList.add('active');
            conceptContainer?.classList.remove('active');
        }
        
        // Активные подразделы
        const subnavItems = document.querySelectorAll('.sidebar__subnav-item');
        subnavItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href) {
                const target = document.querySelector(href);
                if (target) {
                    const targetTop = target.offsetTop;
                    const targetBottom = targetTop + target.offsetHeight;
                    if (scrollPosition >= targetTop - 100 && scrollPosition < targetBottom - 100) {
                        subnavItems.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                    }
                }
            }
        });
    }
    
    // ===== ПЛАВНЫЙ СКРОЛЛ =====
    const allLinks = document.querySelectorAll('.sidebar__section-title, .sidebar__subnav-item');
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const targetPosition = target.offsetTop - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (isMobile()) {
                        closeSidebar();
                    }
                }
            }
        });
    });
    
    // ===== КНОПКА НАВЕРХ =====
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ (Intersection Observer) =====
    const animatedElements = document.querySelectorAll('.slogan-text, .brand-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('slogan-text')) {
                    entry.target.style.animation = 'sloganAppear 0.6s ease-out forwards';
                } else if (entry.target.classList.contains('brand-card')) {
                    entry.target.style.animation = 'cardFadeIn 0.4s ease forwards';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        if (el.classList.contains('slogan-text')) {
            el.style.animation = 'none';
        } else if (el.classList.contains('brand-card')) {
            el.style.animation = 'none';
        }
        observer.observe(el);
    });
    
    // ===== СВОРАЧИВАНИЕ РАЗДЕЛОВ =====
    function initSectionCollapse() {
        const sections = document.querySelectorAll('.section-collapsible');
        
        sections.forEach(section => {
            const header = section.querySelector('.section-header');
            const toggleBtn = section.querySelector('.section-toggle-btn');
            
            if (!header || !toggleBtn) return;
            
            section.classList.remove('is-collapsed');
            
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                section.classList.toggle('is-collapsed');
            });
            
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                section.classList.toggle('is-collapsed');
            });
        });
    }
    
    // ===== ЗАПУСК =====
    setActiveNav();
    setActiveSection();
    window.addEventListener('scroll', () => {
        requestAnimationFrame(setActiveNav);
        requestAnimationFrame(setActiveSection);
    });
    
    initSectionCollapse();
    
    console.log('Брендбук (в)месте загружен!');
});