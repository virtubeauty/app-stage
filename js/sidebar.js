// sidebar.js
class SidebarMenu {
    constructor() {
        this.isOpen = false;
        this.currentTab = localStorage.getItem('currentTab') || 'prototype';
        this.initializeSidebar();
    }

    initializeSidebar() {
        // Create and append sidebar HTML
        const sidebarHTML = `
            <button class="hamburger-btn">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="sidebar">
                <div class="sidebar-header">
                    <img src="assets/logo.png" alt="VirtuBeauty" class="sidebar-logo">
                </div>
                <nav class="sidebar-nav">
                    <div class="nav-item" data-tab="prototype">
                        <span>🤖</span>
                        <span>Prototype</span>
                    </div>
                    <div class="nav-item" data-tab="latest">
                        <span>🆕</span>
                        <span>Latest</span>
                    </div>
                    <div class="nav-item" data-tab="sentient">
                        <span>🧠</span>
                        <span>Sentient</span>
                    </div>
                    <div class="nav-item" data-tab="favorites">
                        <span>⭐</span>
                        <span>Favorites</span>
                        <span class="tab-count" id="favoritesCount">0</span>
                    </div>
                </nav>
            </div>
            <div class="sidebar-overlay"></div>
        `;

        // Insert sidebar into DOM
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

        // Setup event listeners
        this.setupEventListeners();

        // Set initial active tab
        this.setActiveTab(this.currentTab);
    }

    setupEventListeners() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const navItems = document.querySelectorAll('.nav-item');

        // Hamburger button click
        hamburgerBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Overlay click
        overlay.addEventListener('click', () => {
            this.closeSidebar();
        });

        // Tab navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                this.handleTabChange(tab);
                this.closeSidebar();
            });
        });

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });

        // Update counts when they change
        window.addEventListener('tabCountsUpdated', (e) => {
            this.updateTabCounts(e.detail);
        });
    }

    toggleSidebar() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        this.isOpen = !this.isOpen;
        hamburgerBtn.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');

        // Prevent body scroll when sidebar is open
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }

    closeSidebar() {
        if (!this.isOpen) return;

        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        this.isOpen = false;
        hamburgerBtn.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleTabChange(tab) {
        if (tab === this.currentTab) return;

        this.setActiveTab(tab);
        this.currentTab = tab;
        localStorage.setItem('currentTab', tab);

        // Trigger existing tab change functionality
        if (typeof window.switchTab === 'function') {
            window.switchTab(tab);
        }
    }

    setActiveTab(tab) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tab);
        });
    }

    updateTabCounts(counts) {
        Object.entries(counts).forEach(([tab, count]) => {
            const countElement = document.getElementById(`${tab}Count`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarMenu = new SidebarMenu();
});