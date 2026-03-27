// Career Path Intelligence Agent - Interaction Logic
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const analyzeBtn = document.getElementById('analyze-btn');
    const heroSection = document.getElementById('hero-section');
    const loader = document.getElementById('loader');
    const dashboard = document.getElementById('dashboard');
    const searchInput = document.getElementById('job-search');
    const industrySelect = document.getElementById('industry-select');

    // Display Elements
    const displayJobTitle = document.getElementById('display-job-title');
    const displayIndustry = document.getElementById('display-industry');

    // Theme Management
    const THEME_KEY = 'career_ai_theme';
    const initTheme = () => {
        const currentTheme = localStorage.getItem(THEME_KEY);
        // Default to dark mode if user prefers it at OS level, otherwise light
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    };

    const toggleTheme = () => {
        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            localStorage.setItem(THEME_KEY, 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            themeToggle.style.transform = 'rotate(-180deg)';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem(THEME_KEY, 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            themeToggle.style.transform = 'rotate(180deg)';
        }

        // Reset transformation after animation
        setTimeout(() => {
            themeToggle.style.transition = 'none';
            themeToggle.style.transform = 'none';
            setTimeout(() => themeToggle.style.transition = '', 50);
        }, 300);
    };

    themeToggle.addEventListener('click', toggleTheme);
    initTheme(); // Set initial theme

    // Analyze Button Logic
    const startAnalysis = () => {
        const jobRole = searchInput.value.trim();
        if (!jobRole) {
            // Visual feedback for empty input
            searchInput.parentElement.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';

            // Add shake keyframes dynamically if not present
            if (!document.getElementById('shake-style')) {
                const style = document.createElement('style');
                style.id = 'shake-style';
                style.innerHTML = `
                    @keyframes shake {
                        10%, 90% { transform: translate3d(-1px, 0, 0); }
                        20%, 80% { transform: translate3d(2px, 0, 0); }
                        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                        40%, 60% { transform: translate3d(4px, 0, 0); }
                    }
                `;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                searchInput.parentElement.style.animation = '';
            }, 500);

            searchInput.focus();
            return;
        }

        // 1. UI Transitions
        heroSection.classList.add('compact');
        dashboard.classList.add('hidden');

        // Reset bar widths before showing
        document.querySelectorAll('.bar-fill').forEach(bar => {
            bar.dataset.width = bar.style.width; // Store target width
            bar.style.width = '0%';
        });

        // 2. Show Loader container
        loader.classList.remove('hidden');

        // 3. Update Display Data
        // Capitalize words for title display
        const titleCase = str => str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
        displayJobTitle.textContent = titleCase(jobRole);
        displayIndustry.textContent = `${industrySelect.value} Industry`;

        // Generate dynamic mock salary based on length of job title just for demo variation
        const baseSalary = 80000 + (jobRole.length * 2000);
        document.getElementById('avg-salary').textContent = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(baseSalary);

        // 4. Simulate ML Backend Processing
        setTimeout(() => {
            loader.classList.add('hidden');
            dashboard.classList.remove('hidden');

            // Re-trigger bar chart animations sequentially
            const bars = document.querySelectorAll('.bar-fill');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width;
                }, 200 + (index * 150)); // Sequential fill
            });

            // Smooth scroll to dashboard automatically on mobile or if off-screen
            dashboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        }, 1600); // 1.6s faux delay to feel like 'analysis'
    };

    analyzeBtn.addEventListener('click', startAnalysis);

    // Enter key to submit search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            startAnalysis();
        }
    });

    // Bookmark / Save interaction
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            const icon = this.querySelector('i');

            // Pop animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => this.style.transform = '', 200);

            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = 'var(--accent-primary)';

                // Show temporary tooltip/toast
                const toast = document.createElement('div');
                toast.textContent = 'Role saved to your profile';
                toast.style.cssText = `
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--text-primary);
                    color: var(--bg-primary);
                    padding: 10px 20px;
                    border-radius: var(--radius-full);
                    font-size: 0.9rem;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s;
                    box-shadow: var(--shadow-md);
                `;
                document.body.appendChild(toast);

                requestAnimationFrame(() => {
                    toast.style.opacity = '1';
                });

                setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => toast.remove(), 300);
                }, 2000);

            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = 'inherit';
            }
        });
    }

    // Add hover effects to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const dot = item.querySelector('.timeline-dot');
            dot.style.transform = 'scale(1.3)';
        });
        item.addEventListener('mouseleave', () => {
            const dot = item.querySelector('.timeline-dot');
            dot.style.transform = '';
        });
    });
});
