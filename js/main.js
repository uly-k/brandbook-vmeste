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
    
    const savedState = localStorage.getItem('brandbook-sidebar');
    if (savedState === 'closed') {
        closeSidebar();
    } else {
        openSidebar();
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }
    
    document.addEventListener('click', (e) => {
        if (isMobile() && sidebar.classList.contains('is-open-mobile')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                closeSidebar();
            }
        }
    });
    
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
    
    // ===== АКТИВНЫЙ ПУНКТ МЕНЮ =====
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
    
    // ===== АКТИВНЫЕ РАЗДЕЛЫ =====
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
    
    // ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ =====
    const animatedElements = document.querySelectorAll('.slogan-text, .brand-card, .trend-large-text');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('slogan-text')) {
                    entry.target.style.animation = 'sloganAppear 0.6s ease-out forwards';
                } else if (entry.target.classList.contains('trend-large-text')) {
                    entry.target.classList.add('animated');
                } else if (entry.target.classList.contains('brand-card')) {
                    entry.target.style.animation = 'cardFadeIn 0.4s ease forwards';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        if (el.classList.contains('slogan-text') || el.classList.contains('trend-large-text')) {
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
    
    // ===== ПЕРЕКЛЮЧАТЕЛИ ДЛЯ КАРТОЧКИ ЦА =====
    function initAudienceToggles() {
        const tabs = document.querySelectorAll('.audience-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const card = tab.closest('.brand-card--audience');
                const audienceValue = tab.getAttribute('data-audience');
                
                card.querySelectorAll('.audience-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                card.querySelectorAll('.audience-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const activeContent = card.querySelector(`.audience-content[data-content="${audienceValue}"]`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
                
                const allPersonas = document.querySelectorAll('.persona-card');
                allPersonas.forEach(persona => {
                    persona.classList.add('hidden-persona');
                });
                
                const visiblePersonas = document.querySelectorAll(`.persona-card[data-persona-group="${audienceValue}"]`);
                visiblePersonas.forEach(persona => {
                    persona.classList.remove('hidden-persona');
                });
            });
        });
    }
    
    // ===== ПЕРЕКЛЮЧАТЕЛИ ДЛЯ ЦЕННОСТЕЙ =====
    function initValuesToggles() {
        const tabs = document.querySelectorAll('.values-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const card = tab.closest('.brand-card--values-toggles');
                const valueValue = tab.getAttribute('data-value');
                
                card.querySelectorAll('.values-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                card.querySelectorAll('.values-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const activeContent = card.querySelector(`.values-content[data-value-content="${valueValue}"]`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });
    }
    
    // ===== СТРАТЕГИЯ ЦВЕТА =====
    function initColorStrategy() {
        const mainPanel = document.querySelector('.color-panel--main');
        const sensoryPanel = document.querySelector('.color-panel--sensory');
        const slider = document.getElementById('colorSlider');
        
        if (!mainPanel || !sensoryPanel || !slider) return;
        
        const mainColors = ['#0077FF', '#BEF655'];
        const sensoryColors = ['#5A8FBF', '#A4D46A'];
        
        function interpolateColor(color1, color2, t) {
            const c1 = hexToRgb(color1);
            const c2 = hexToRgb(color2);
            const r = Math.round(c1.r + (c2.r - c1.r) * t);
            const g = Math.round(c1.g + (c2.g - c1.g) * t);
            const b = Math.round(c1.b + (c2.b - c1.b) * t);
            return `rgb(${r}, ${g}, ${b})`;
        }
        
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        }
        
        function updateColors(value) {
            const t = value / 100;
            const mainColor = interpolateColor(mainColors[0], mainColors[1], t);
            const sensoryColor = interpolateColor(sensoryColors[0], sensoryColors[1], t);
            
            mainPanel.style.backgroundColor = mainColor;
            sensoryPanel.style.backgroundColor = sensoryColor;
            slider.style.background = `linear-gradient(to right, ${mainColor}, ${sensoryColor})`;
        }
        
        slider.addEventListener('input', (e) => {
            updateColors(e.target.value);
        });
        
        updateColors(50);
    }
    
    // ===== ЗАПУСК =====
    setActiveNav();
    setActiveSection();
    window.addEventListener('scroll', () => {
        requestAnimationFrame(setActiveNav);
        requestAnimationFrame(setActiveSection);
    });
    
    initSectionCollapse();
    initAudienceToggles();
    initValuesToggles();
    initColorStrategy();
    
    console.log('Брендбук (в)месте загружен!');
});


// ===== ПЕРЕКЛЮЧАТЕЛИ ДЛЯ МАРКЕТИНГОВЫХ ЦЕЛЕЙ =====
function initMarketingToggles() {
    const tabs = document.querySelectorAll('.marketing-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const card = tab.closest('.marketing-toggles-card');
            const marketingValue = tab.getAttribute('data-marketing');
            
            card.querySelectorAll('.marketing-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            card.querySelectorAll('.marketing-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const activeContent = card.querySelector(`.marketing-content[data-marketing-content="${marketingValue}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// ===== ПЕРЕКЛЮЧАТЕЛИ ДЛЯ РЕКЛАМНЫХ ФОРМАТОВ =====
function initFormatsToggles() {
    const tabs = document.querySelectorAll('.formats-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const card = tab.closest('.marketing-formats-card');
            const formatValue = tab.getAttribute('data-format');
            
            card.querySelectorAll('.formats-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            card.querySelectorAll('.formats-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const activeContent = card.querySelector(`.formats-content[data-format-content="${formatValue}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// Добавь вызовы в DOMContentLoaded или в конец
initMarketingToggles();
initFormatsToggles();


// ===== ЛОГОТИП: ТОГЛЫ ДЛЯ ВАРИАНТОВ ЛОГОТИПА =====
function initLogoToggles() {
    const tabs = document.querySelectorAll('.logo-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const card = tab.closest('.logo-variants-card');
            const logoValue = tab.getAttribute('data-logo');
            
            card.querySelectorAll('.logo-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            card.querySelectorAll('.logo-image-wrapper').forEach(wrapper => {
                wrapper.classList.remove('active');
            });
            
            const activeWrapper = card.querySelector(`.logo-image-wrapper[data-logo-display="${logoValue}"]`);
            if (activeWrapper) {
                activeWrapper.classList.add('active');
            }
        });
    });
}

// ===== ЛОГОТИП: ТОГЛЫ ДЛЯ СОКРАЩЁННОГО ЛОГОТИПА =====
function initSymbolToggles() {
    const tabs = document.querySelectorAll('.symbol-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const card = tab.closest('.logo-symbol-card');
            const symbolValue = tab.getAttribute('data-symbol');
            
            card.querySelectorAll('.symbol-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            card.querySelectorAll('.symbol-image-wrapper').forEach(wrapper => {
                wrapper.classList.remove('active');
            });
            
            const activeWrapper = card.querySelector(`.symbol-image-wrapper[data-symbol-display="${symbolValue}"]`);
            if (activeWrapper) {
                activeWrapper.classList.add('active');
            }
        });
    });
}

// ===== ЛОГОТИП: ПОЛЗУНОК МАСШТАБИРОВАНИЯ =====
function initLogoResize() {
    const slider = document.getElementById('logoSizeSlider');
    const logo = document.getElementById('resizeLogo');
    
    if (!slider || !logo) return;
    
    const fullLogo = 'media/logo-full.svg';
    const signLogo = 'media/logo-sign.svg';
    
    slider.addEventListener('input', (e) => {
        const size = e.target.value;
        logo.style.width = size + 'px';
        logo.style.height = 'auto';
        
        // При размере меньше 40px переключаем на знак
        if (size < 40) {
            logo.src = signLogo;
        } else {
            logo.src = fullLogo;
        }
    });
}

// ===== ЛОГОТИП: ЦВЕТОВЫЕ ВАРИАЦИИ =====
function initColorVariants() {
    const tabs = document.querySelectorAll('.color-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const card = tab.closest('.logo-colors-card');
            const colorValue = tab.getAttribute('data-color-variant');
            
            card.querySelectorAll('.color-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            card.querySelectorAll('.color-variant').forEach(variant => {
                variant.classList.remove('active');
            });
            
            const activeVariant = card.querySelector(`.color-variant[data-color-display="${colorValue}"]`);
            if (activeVariant) {
                activeVariant.classList.add('active');
            }
        });
    });
}

// ===== ЛОГОТИП: ЗАПРЕЩЁННЫЕ МОДИФИКАЦИИ =====
function initForbiddenToggles() {
    const tabs = document.querySelectorAll('.forbidden-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const card = tab.closest('.logo-forbidden-card');
            const forbiddenValue = tab.getAttribute('data-forbidden');
            
            card.querySelectorAll('.forbidden-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            card.querySelectorAll('.forbidden-item-wrapper').forEach(wrapper => {
                wrapper.classList.remove('active');
            });
            
            const activeWrapper = card.querySelector(`.forbidden-item-wrapper[data-forbidden-display="${forbiddenValue}"]`);
            if (activeWrapper) {
                activeWrapper.classList.add('active');
            }
        });
    });
}

// Добавь вызовы
initLogoToggles();
initSymbolToggles();
initLogoResize();
initColorVariants();
initForbiddenToggles();


// ===== КОПИРОВАНИЕ ЦВЕТОВ =====
function copyColor(button, colorCode) {
    // Копируем в буфер обмена
    navigator.clipboard.writeText(colorCode).then(() => {
        // Создаём уведомление
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = `скопировано: ${colorCode}`;
        document.body.appendChild(toast);
        
        // Удаляем уведомление через 2 секунды
        setTimeout(() => {
            toast.remove();
        }, 2000);
        
        // Визуальный фидбек на кнопке
        const originalText = button.textContent;
        button.textContent = 'скопировано ✓';
        setTimeout(() => {
            button.textContent = originalText;
        }, 1500);
    }).catch(() => {
        // Если не получилось скопировать
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.style.backgroundColor = 'var(--blue)';
        toast.textContent = 'нажми Ctrl+C, чтобы скопировать';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 1500);
    });
}

// ===== ТИПОГРАФИКА: ПЕРЕКЛЮЧАТЕЛИ РАЗМЕРОВ ТЕКСТА =====
function initTypographyToggles() {
    const elementTabs = document.querySelectorAll('.size-element-tab');
    const deviceTabs = document.querySelectorAll('.size-device-tab');
    
    function updatePreview() {
        const activeElement = document.querySelector('.size-element-tab.active')?.getAttribute('data-element');
        const activeDevice = document.querySelector('.size-device-tab.active')?.getAttribute('data-device');
        
        if (!activeElement || !activeDevice) return;
        
        // Скрываем все примеры
        document.querySelectorAll('.size-example').forEach(el => {
            el.classList.remove('active');
        });
        
        // Показываем нужный
        const activePreview = document.querySelector(`.size-example[data-element="${activeElement}"][data-device="${activeDevice}"]`);
        if (activePreview) {
            activePreview.classList.add('active');
        }
    }
    
    elementTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elementTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updatePreview();
        });
    });
    
    deviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            deviceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updatePreview();
        });
    });
}

// Вызов
initTypographyToggles();

// ===== ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ: ПЕРЕКЛЮЧАТЕЛИ =====
function initDecorToggles() {
    const tabs = document.querySelectorAll('.decor-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const card = tab.closest('.decorative-elements-card');
            const decorValue = tab.getAttribute('data-decor');
            
            card.querySelectorAll('.decor-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            card.querySelectorAll('.decor-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const activeContent = card.querySelector(`.decor-content[data-decor-content="${decorValue}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

initDecorToggles();
// ===== ИНТЕРАКТИВНОЕ МОДАЛЬНОЕ ОКНО НОСИТЕЛЕЙ =====
function initCarrierModal() {
    const modal = document.getElementById('carrierModal');
    if (!modal) return;

    const backdrop    = document.getElementById('carrierModalBackdrop');
    const closeBtn    = document.getElementById('carrierModalClose');
    const titleEl     = document.getElementById('carrierModalTitle');
    const imgEl       = document.getElementById('carrierModalImg');
    const descEl      = document.getElementById('carrierModalDesc');
    const metaLabel   = document.getElementById('carrierModalMetaLabel');
    const metaValue   = document.getElementById('carrierModalMetaValue');
    const colorsEl    = document.getElementById('carrierModalColors');
    const thumbsEl    = document.getElementById('carrierModalThumbs');
    const mockupBtn   = document.getElementById('carrierModalMockupBtn');
    const layoutBtn   = document.getElementById('carrierModalLayoutBtn');

    let currentData = {};
    let currentColor = '';
    let currentView = 'mockup'; // 'mockup' или 'layout'

    function openModal(card) {
        // Собираем данные из карточки
        const title      = card.dataset.title || '';
        const desc       = card.dataset.desc || '';
        const material   = card.dataset.material || '';
        
        // Парсим цвета и соответствующие им изображения для мокапа
        const colorsMapStr = card.dataset.colorsMap || '';
        const colorsMap = {};
        if (colorsMapStr) {
            colorsMapStr.split(',').forEach(item => {
                const [colorKey, imageSrc] = item.split(':');
                if (colorKey && imageSrc) {
                    colorsMap[colorKey.trim()] = imageSrc.trim();
                }
            });
        }
        
        // Парсим макеты для каждого цвета (если есть)
        const layoutsMapStr = card.dataset.layoutsMap || '';
        const layoutsMap = {};
        if (layoutsMapStr) {
            layoutsMapStr.split(',').forEach(item => {
                const [colorKey, imageSrc] = item.split(':');
                if (colorKey && imageSrc) {
                    layoutsMap[colorKey.trim()] = imageSrc.trim();
                }
            });
        }
        
        // Список цветов
        const colorListStr = card.dataset.colorList || '';
        const colorList = colorListStr ? colorListStr.split(',').map(c => c.trim()) : Object.keys(colorsMap);
        
        // Изображения для миниатюр (если есть)
        const thumbsStr = card.dataset.thumbs || '';
        const thumbImages = thumbsStr ? thumbsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
        
        // Главное изображение по умолчанию
        const defaultColor = colorList[0] || '';
        const defaultImage = colorsMap[defaultColor] || '';
        
        currentData = {
            title: title,
            desc: desc,
            material: material,
            colorsMap: colorsMap,
            layoutsMap: layoutsMap,
            colorList: colorList,
            thumbImages: thumbImages,
            defaultImage: defaultImage,
            defaultColor: defaultColor
        };
        currentColor = defaultColor;
        currentView = 'mockup';

        // Заполняем поля
        titleEl.textContent = title;
        descEl.textContent = desc;
        metaLabel.textContent = 'Материал';
        metaValue.textContent = material;

        // Устанавливаем главное изображение
        updateMainImage();

        // Создаём цветовые точки
        colorsEl.innerHTML = '';
        colorList.forEach(color => {
            const dot = document.createElement('button');
            dot.className = 'carrier-modal__color-dot';
            if (color === currentColor) dot.classList.add('active');
            
            // Определяем цвет точки
            switch(color) {
                case 'blue': dot.style.backgroundColor = '#0077FF'; break;
                case 'green': dot.style.backgroundColor = '#BEF655'; break;
                case 'white': dot.style.backgroundColor = '#FFFFFF'; dot.style.border = '1px solid #E0E0E0'; break;
                case 'black': dot.style.backgroundColor = '#000000'; break;
                case 'lightblue': dot.style.backgroundColor = '#EAF4FF'; dot.style.border = '1px solid #E0E0E0'; break;
                default: dot.style.backgroundColor = color;
            }
            
            dot.setAttribute('data-color', color);
            dot.addEventListener('click', () => {
                colorsEl.querySelectorAll('.carrier-modal__color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                currentColor = color;
                updateMainImage();
            });
            colorsEl.appendChild(dot);
        });

        // Создаём миниатюры
        thumbsEl.innerHTML = '';
        if (thumbImages.length > 0) {
            thumbImages.forEach((src, i) => {
                const thumb = document.createElement('button');
                thumb.className = 'carrier-modal__thumb' + (i === 0 ? ' active' : '');
                thumb.innerHTML = `<img src="${src}" alt="${title} ${i + 1}">`;
                thumb.addEventListener('click', () => {
                    imgEl.src = src;
                    thumbsEl.querySelectorAll('.carrier-modal__thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    currentView = 'thumb';
                });
                thumbsEl.appendChild(thumb);
            });
        }

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function updateMainImage() {
        let imageSrc = '';
        if (currentView === 'mockup') {
            imageSrc = currentData.colorsMap[currentColor] || currentData.defaultImage;
        } else if (currentView === 'layout') {
            imageSrc = currentData.layoutsMap[currentColor] || '';
            // если нет макета для этого цвета, показываем мокап
            if (!imageSrc) {
                imageSrc = currentData.colorsMap[currentColor] || currentData.defaultImage;
            }
        }
        
        if (imageSrc) {
            const imgEl = document.getElementById('carrierModalImg');
            if (imgEl) imgEl.src = imageSrc;
        }
    }

    function switchToMockup() {
        currentView = 'mockup';
        updateMainImage();
        // Визуальное состояние кнопок
        if (mockupBtn) mockupBtn.classList.add('active');
        if (layoutBtn) layoutBtn.classList.remove('active');
    }

    function switchToLayout() {
        currentView = 'layout';
        updateMainImage();
        if (layoutBtn) layoutBtn.classList.add('active');
        if (mockupBtn) mockupBtn.classList.remove('active');
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Навешиваем обработчики на карточки
    document.querySelectorAll('.media-item-card').forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    // Кнопки мокап / макет
    if (mockupBtn) mockupBtn.addEventListener('click', switchToMockup);
    if (layoutBtn) layoutBtn.addEventListener('click', switchToLayout);

    // Закрытие
    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

initCarrierModal();