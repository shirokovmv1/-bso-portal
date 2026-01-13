/* ============================================
   БСО Корпоративный Портал - JavaScript
   Строительная компания БСО (bso-cc.ru)
   Москва, Ленинский пр., д. 11, стр. 2
   
   Поддержка:
   - Серверное хранение (PHP API на Synology)
   - Локальное хранение (localStorage для тестирования)
   ============================================ */

// ============================================
// Конфигурация
// ============================================

const CONFIG = {
    // Установите true для работы с сервером Synology
    useServerStorage: false,
    
    // URL API (измените на адрес вашего Synology)
    apiUrl: '/api',
    
    // Ключ для localStorage
    storageKey: 'bso_portal_data'
};

// Автоопределение режима работы
(function detectMode() {
    // Если есть папка api и мы на сервере - используем API
    if (window.location.protocol !== 'file:') {
        fetch(CONFIG.apiUrl + '/news.php', { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    CONFIG.useServerStorage = true;
                    console.log('🌐 Режим: Серверное хранение (Synology)');
                }
            })
            .catch(() => {
                console.log('💾 Режим: Локальное хранение (localStorage)');
            });
    }
})();

// Данные по умолчанию
const DEFAULT_DATA = {
    news: [
        {
            id: 1,
            date: '2026-01-13',
            title: 'Добро пожаловать на корпоративный портал БСО!',
            text: 'Строим будущее с надёжностью и инновациями. Более 15 лет опыта в строительстве промышленных и гражданских объектов.'
        },
        {
            id: 2,
            date: '2026-01-10',
            title: 'Новый проект: генеральный подряд',
            text: 'Компания приступила к реализации нового проекта полного цикла строительства под ключ.'
        }
    ],
    events: [
        {
            id: 1,
            date: '2026-01-20',
            title: 'Совещание по проекту',
            text: 'Обсуждение этапов реализации текущих проектов в офисе компании'
        },
        {
            id: 2,
            date: '2026-01-25',
            title: 'Обучение по охране труда',
            text: 'Обязательный инструктаж по технике безопасности для всех сотрудников'
        }
    ],
    applications: [
        {
            id: 1,
            name: 'Заявка на согласование договора',
            description: 'Согласование или изменение договорных документов с контрагентами',
            url: 'forms/contract-request.html'
        },
        {
            id: 2,
            name: 'Заявка на отпуск',
            description: 'Форма заявления на ежегодный оплачиваемый отпуск',
            url: 'forms/vacation.html'
        },
        {
            id: 3,
            name: 'Заявка на командировку',
            description: 'Оформление командировочных документов для выезда на объекты',
            url: 'forms/business-trip.html'
        },
        {
            id: 4,
            name: 'Заявка на материалы',
            description: 'Запрос строительных материалов и оборудования',
            url: 'forms/materials.html'
        }
    ],
    contacts: [
        {
            id: 1,
            name: 'Приёмная',
            position: 'Общие вопросы',
            department: 'Руководство',
            phone: '+7 (495) 147-55-66',
            email: 'info@bso-cc.ru'
        },
        {
            id: 2,
            name: 'Отдел проектирования',
            position: 'Проектная документация',
            department: 'Проектирование',
            phone: '+7 (495) 147-55-66',
            email: 'project@bso-cc.ru'
        },
        {
            id: 3,
            name: 'IT отдел',
            position: 'Техническая поддержка',
            department: 'IT отдел',
            phone: '+7 (495) 147-55-66',
            email: 'it@bso-cc.ru'
        }
    ],
    faq: [
        {
            id: 1,
            question: 'Как подключиться к корпоративной сети VPN?',
            answer: 'Для подключения к VPN необходимо установить приложение OpenVPN и использовать конфигурационный файл, который можно получить в IT отделе. После установки введите свои корпоративные учётные данные.'
        },
        {
            id: 2,
            question: 'Как сбросить пароль от рабочего компьютера?',
            answer: 'Для сброса пароля обратитесь в IT отдел по телефону или создайте заявку в Help Desk. Специалист поможет восстановить доступ к вашей учётной записи.'
        },
        {
            id: 3,
            question: 'Как получить доступ к общим папкам?',
            answer: 'Доступ к общим сетевым папкам предоставляется согласно вашей должности. Для получения дополнительного доступа создайте заявку с указанием необходимых ресурсов и обоснованием.'
        }
    ],
    manuals: [
        {
            id: 1,
            title: 'Инструкция по работе с почтой',
            description: 'Настройка почтового клиента и основы работы',
            url: 'manuals/email.pdf'
        },
        {
            id: 2,
            title: 'Руководство по 1С',
            description: 'Базовые операции в программе 1С:Предприятие',
            url: 'manuals/1c-guide.pdf'
        }
    ]
};

// ============================================
// API Client (для работы с сервером)
// ============================================

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        let url = `${this.baseUrl}/${endpoint}.php`;
        if (method === 'DELETE' && data?.id) {
            url += `?id=${data.id}`;
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error: ${endpoint}`, error);
            throw error;
        }
    }

    // News
    async getNews() { return this.request('news'); }
    async addNews(data) { return this.request('news', 'POST', data); }
    async updateNews(data) { return this.request('news', 'PUT', data); }
    async deleteNews(id) { return this.request('news', 'DELETE', { id }); }

    // Events
    async getEvents() { return this.request('events'); }
    async addEvent(data) { return this.request('events', 'POST', data); }
    async updateEvent(data) { return this.request('events', 'PUT', data); }
    async deleteEvent(id) { return this.request('events', 'DELETE', { id }); }

    // Applications
    async getApplications() { return this.request('applications'); }
    async addApplication(data) { return this.request('applications', 'POST', data); }
    async updateApplication(data) { return this.request('applications', 'PUT', data); }
    async deleteApplication(id) { return this.request('applications', 'DELETE', { id }); }

    // Contacts
    async getContacts() { return this.request('contacts'); }
    async addContact(data) { return this.request('contacts', 'POST', data); }
    async updateContact(data) { return this.request('contacts', 'PUT', data); }
    async deleteContact(id) { return this.request('contacts', 'DELETE', { id }); }

    // FAQ
    async getFaq() { return this.request('faq'); }
    async addFaq(data) { return this.request('faq', 'POST', data); }
    async updateFaq(data) { return this.request('faq', 'PUT', data); }
    async deleteFaq(id) { return this.request('faq', 'DELETE', { id }); }
}

const api = new ApiClient(CONFIG.apiUrl);

// ============================================
// Data Manager (универсальный)
// ============================================

class DataManager {
    constructor() {
        this.storageKey = CONFIG.storageKey;
        this.cache = {};
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_DATA));
        }
    }

    // Локальное хранение
    getLocalData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : DEFAULT_DATA;
    }

    saveLocalData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // =====================
    // News
    // =====================
    async getNews() {
        if (CONFIG.useServerStorage) {
            try {
                return await api.getNews();
            } catch {
                return this.getLocalData().news || [];
            }
        }
        return this.getLocalData().news || [];
    }

    async addNews(news) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.addNews(news);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        news.id = Date.now();
        data.news.unshift(news);
        this.saveLocalData(data);
        return news;
    }

    async updateNews(id, updatedNews) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.updateNews({ id, ...updatedNews });
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        const index = data.news.findIndex(n => n.id === id);
        if (index !== -1) {
            data.news[index] = { ...data.news[index], ...updatedNews };
            this.saveLocalData(data);
        }
    }

    async deleteNews(id) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.deleteNews(id);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        data.news = data.news.filter(n => n.id !== id);
        this.saveLocalData(data);
    }

    // =====================
    // Events
    // =====================
    async getEvents() {
        if (CONFIG.useServerStorage) {
            try {
                return await api.getEvents();
            } catch {
                return this.getLocalData().events || [];
            }
        }
        return this.getLocalData().events || [];
    }

    async addEvent(event) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.addEvent(event);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        event.id = Date.now();
        data.events.unshift(event);
        this.saveLocalData(data);
        return event;
    }

    async updateEvent(id, updatedEvent) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.updateEvent({ id, ...updatedEvent });
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        const index = data.events.findIndex(e => e.id === id);
        if (index !== -1) {
            data.events[index] = { ...data.events[index], ...updatedEvent };
            this.saveLocalData(data);
        }
    }

    async deleteEvent(id) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.deleteEvent(id);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        data.events = data.events.filter(e => e.id !== id);
        this.saveLocalData(data);
    }

    // =====================
    // Applications
    // =====================
    async getApplications() {
        if (CONFIG.useServerStorage) {
            try {
                return await api.getApplications();
            } catch {
                return this.getLocalData().applications || [];
            }
        }
        return this.getLocalData().applications || [];
    }

    async addApplication(app) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.addApplication(app);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        app.id = Date.now();
        data.applications.push(app);
        this.saveLocalData(data);
        return app;
    }

    async updateApplication(id, updatedApp) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.updateApplication({ id, ...updatedApp });
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        const index = data.applications.findIndex(a => a.id === id);
        if (index !== -1) {
            data.applications[index] = { ...data.applications[index], ...updatedApp };
            this.saveLocalData(data);
        }
    }

    async deleteApplication(id) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.deleteApplication(id);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        data.applications = data.applications.filter(a => a.id !== id);
        this.saveLocalData(data);
    }

    // =====================
    // Contacts
    // =====================
    async getContacts() {
        if (CONFIG.useServerStorage) {
            try {
                return await api.getContacts();
            } catch {
                return this.getLocalData().contacts || [];
            }
        }
        return this.getLocalData().contacts || [];
    }

    async addContact(contact) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.addContact(contact);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        contact.id = Date.now();
        data.contacts.push(contact);
        this.saveLocalData(data);
        return contact;
    }

    async updateContact(id, updatedContact) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.updateContact({ id, ...updatedContact });
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        const index = data.contacts.findIndex(c => c.id === id);
        if (index !== -1) {
            data.contacts[index] = { ...data.contacts[index], ...updatedContact };
            this.saveLocalData(data);
        }
    }

    async deleteContact(id) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.deleteContact(id);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        data.contacts = data.contacts.filter(c => c.id !== id);
        this.saveLocalData(data);
    }

    // =====================
    // FAQ
    // =====================
    async getFaq() {
        if (CONFIG.useServerStorage) {
            try {
                return await api.getFaq();
            } catch {
                return this.getLocalData().faq || [];
            }
        }
        return this.getLocalData().faq || [];
    }

    async addFaq(faq) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.addFaq(faq);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        faq.id = Date.now();
        data.faq.push(faq);
        this.saveLocalData(data);
        return faq;
    }

    async updateFaq(id, updatedFaq) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.updateFaq({ id, ...updatedFaq });
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        const index = data.faq.findIndex(f => f.id === id);
        if (index !== -1) {
            data.faq[index] = { ...data.faq[index], ...updatedFaq };
            this.saveLocalData(data);
        }
    }

    async deleteFaq(id) {
        if (CONFIG.useServerStorage) {
            try {
                return await api.deleteFaq(id);
            } catch (e) { console.error(e); }
        }
        const data = this.getLocalData();
        data.faq = data.faq.filter(f => f.id !== id);
        this.saveLocalData(data);
    }

    // =====================
    // Manuals (только локально)
    // =====================
    getManuals() {
        return this.getLocalData().manuals || [];
    }

    addManual(manual) {
        const data = this.getLocalData();
        manual.id = Date.now();
        data.manuals.push(manual);
        this.saveLocalData(data);
        return manual;
    }

    deleteManual(id) {
        const data = this.getLocalData();
        data.manuals = data.manuals.filter(m => m.id !== id);
        this.saveLocalData(data);
    }

    // Reset
    resetToDefaults() {
        localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_DATA));
    }
}

// Global instance
const dataManager = new DataManager();

// ============================================
// Utility Functions
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

function formatShortDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// Modal Functions
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeAllModals();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// ============================================
// Clock
// ============================================

function updateClock() {
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit', 
            minute: '2-digit'
        };
        clockElement.textContent = now.toLocaleDateString('ru-RU', options);
    }
}

// Update clock every minute
setInterval(updateClock, 60000);

// ============================================
// Page Renderers
// ============================================

// Render News List
async function renderNews(containerId = 'news-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const news = await dataManager.getNews();
    
    if (news.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📰</div>
                <p>Новостей пока нет</p>
            </div>
        `;
        return;
    }

    container.innerHTML = news.map(item => `
        <div class="news-item" data-id="${item.id}">
            <div class="news-date">${formatDate(item.date)}</div>
            <div class="news-title">${escapeHtml(item.title)}</div>
            <div class="news-text">${escapeHtml(item.text)}</div>
        </div>
    `).join('');
}

// Render Events List
async function renderEvents(containerId = 'events-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const events = await dataManager.getEvents();
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📅</div>
                <p>Событий пока нет</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(item => `
        <div class="event-item" data-id="${item.id}">
            <div class="event-date">📅 ${formatDate(item.date)}</div>
            <div class="event-title">${escapeHtml(item.title)}</div>
            <div class="event-text">${escapeHtml(item.text)}</div>
        </div>
    `).join('');
}

// Render Applications
async function renderApplications(containerId = 'applications-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const applications = await dataManager.getApplications();
    
    if (applications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📋</div>
                <p>Заявок пока нет</p>
            </div>
        `;
        return;
    }

    container.innerHTML = applications.map(app => `
        <div class="application-card" data-id="${app.id}">
            <div class="icon">📝</div>
            <h3>${escapeHtml(app.name)}</h3>
            <p>${escapeHtml(app.description)}</p>
            <a href="${escapeHtml(app.url)}" target="_blank">
                Открыть форму →
            </a>
        </div>
    `).join('');
}

// Render Contacts Table
async function renderContacts(containerId = 'contacts-table') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const contacts = await dataManager.getContacts();
    
    if (contacts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">👥</div>
                <p>Список контактов пуст</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ФИО</th>
                        <th>Должность</th>
                        <th>Отдел</th>
                        <th>Телефон</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    ${contacts.map(contact => `
                        <tr data-id="${contact.id}">
                            <td><strong>${escapeHtml(contact.name)}</strong></td>
                            <td>${escapeHtml(contact.position)}</td>
                            <td>${escapeHtml(contact.department)}</td>
                            <td>${escapeHtml(contact.phone)}</td>
                            <td><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Render FAQ
async function renderFaq(containerId = 'faq-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const faq = await dataManager.getFaq();
    
    if (faq.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">❓</div>
                <p>FAQ пока пуст</p>
            </div>
        `;
        return;
    }

    container.innerHTML = faq.map(item => `
        <div class="faq-item" data-id="${item.id}">
            <div class="faq-question" onclick="toggleFaq(this)">
                <span>${escapeHtml(item.question)}</span>
                <span class="arrow">▼</span>
            </div>
            <div class="faq-answer">
                <div class="faq-answer-content">${escapeHtml(item.answer)}</div>
            </div>
        </div>
    `).join('');
}

function toggleFaq(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('open');
}

// Render Manuals
function renderManuals(containerId = 'manuals-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const manuals = dataManager.getManuals();
    
    if (manuals.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📚</div>
                <p>Мануалов пока нет</p>
            </div>
        `;
        return;
    }

    container.innerHTML = manuals.map(manual => `
        <div class="application-card" data-id="${manual.id}">
            <div class="icon">📖</div>
            <h3>${escapeHtml(manual.title)}</h3>
            <p>${escapeHtml(manual.description)}</p>
            <a href="${escapeHtml(manual.url)}" target="_blank">
                Открыть документ →
            </a>
        </div>
    `).join('');
}

// ============================================
// Admin Panel Functions
// ============================================

function switchAdminTab(tabName) {
    // Update tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${tabName}`).classList.add('active');

    // Render content
    renderAdminSection(tabName);
}

function renderAdminSection(section) {
    switch (section) {
        case 'news':
            renderAdminNews();
            break;
        case 'events':
            renderAdminEvents();
            break;
        case 'applications':
            renderAdminApplications();
            break;
        case 'contacts':
            renderAdminContacts();
            break;
        case 'faq':
            renderAdminFaq();
            break;
    }
}

async function renderAdminNews() {
    const container = document.getElementById('admin-news-list');
    if (!container) return;

    const news = await dataManager.getNews();
    
    container.innerHTML = news.map(item => `
        <div class="item-row" data-id="${item.id}">
            <div class="item-info">
                <div class="item-title">${escapeHtml(item.title)}</div>
                <div class="item-meta">${formatShortDate(item.date)}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editNews(${item.id})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteNews(${item.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function renderAdminEvents() {
    const container = document.getElementById('admin-events-list');
    if (!container) return;

    const events = await dataManager.getEvents();
    
    container.innerHTML = events.map(item => `
        <div class="item-row" data-id="${item.id}">
            <div class="item-info">
                <div class="item-title">${escapeHtml(item.title)}</div>
                <div class="item-meta">${formatShortDate(item.date)}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editEvent(${item.id})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${item.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function renderAdminApplications() {
    const container = document.getElementById('admin-applications-list');
    if (!container) return;

    const applications = await dataManager.getApplications();
    
    container.innerHTML = applications.map(app => `
        <div class="item-row" data-id="${app.id}">
            <div class="item-info">
                <div class="item-title">${escapeHtml(app.name)}</div>
                <div class="item-meta">${escapeHtml(app.url)}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editApplication(${app.id})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteApplication(${app.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function renderAdminContacts() {
    const container = document.getElementById('admin-contacts-list');
    if (!container) return;

    const contacts = await dataManager.getContacts();
    
    container.innerHTML = contacts.map(contact => `
        <div class="item-row" data-id="${contact.id}">
            <div class="item-info">
                <div class="item-title">${escapeHtml(contact.name)}</div>
                <div class="item-meta">${escapeHtml(contact.position)} — ${escapeHtml(contact.department)}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editContact(${contact.id})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteContact(${contact.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

async function renderAdminFaq() {
    const container = document.getElementById('admin-faq-list');
    if (!container) return;

    const faq = await dataManager.getFaq();
    
    container.innerHTML = faq.map(item => `
        <div class="item-row" data-id="${item.id}">
            <div class="item-info">
                <div class="item-title">${escapeHtml(item.question)}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editFaq(${item.id})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteFaq(${item.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}

// ============================================
// CRUD Operations for Admin
// ============================================

// News
let currentEditNewsId = null;

function openAddNewsModal() {
    currentEditNewsId = null;
    document.getElementById('news-form').reset();
    document.getElementById('news-date').value = getCurrentDate();
    document.getElementById('news-modal-title').textContent = 'Добавить новость';
    openModal('news-modal');
}

async function editNews(id) {
    const news = (await dataManager.getNews()).find(n => n.id === id);
    if (!news) return;

    currentEditNewsId = id;
    document.getElementById('news-title').value = news.title;
    document.getElementById('news-date').value = news.date;
    document.getElementById('news-text').value = news.text;
    document.getElementById('news-modal-title').textContent = 'Редактировать новость';
    openModal('news-modal');
}

async function saveNews() {
    const title = document.getElementById('news-title').value.trim();
    const date = document.getElementById('news-date').value;
    const text = document.getElementById('news-text').value.trim();

    if (!title || !date || !text) {
        alert('Заполните все поля');
        return;
    }

    if (currentEditNewsId) {
        await dataManager.updateNews(currentEditNewsId, { title, date, text });
    } else {
        await dataManager.addNews({ title, date, text });
    }

    closeModal('news-modal');
    renderAdminNews();
}

async function deleteNews(id) {
    if (confirm('Удалить эту новость?')) {
        await dataManager.deleteNews(id);
        renderAdminNews();
    }
}

// Events
let currentEditEventId = null;

function openAddEventModal() {
    currentEditEventId = null;
    document.getElementById('event-form').reset();
    document.getElementById('event-date').value = getCurrentDate();
    document.getElementById('event-modal-title').textContent = 'Добавить событие';
    openModal('event-modal');
}

async function editEvent(id) {
    const event = (await dataManager.getEvents()).find(e => e.id === id);
    if (!event) return;

    currentEditEventId = id;
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-text').value = event.text;
    document.getElementById('event-modal-title').textContent = 'Редактировать событие';
    openModal('event-modal');
}

async function saveEvent() {
    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value;
    const text = document.getElementById('event-text').value.trim();

    if (!title || !date || !text) {
        alert('Заполните все поля');
        return;
    }

    if (currentEditEventId) {
        await dataManager.updateEvent(currentEditEventId, { title, date, text });
    } else {
        await dataManager.addEvent({ title, date, text });
    }

    closeModal('event-modal');
    renderAdminEvents();
}

async function deleteEvent(id) {
    if (confirm('Удалить это событие?')) {
        await dataManager.deleteEvent(id);
        renderAdminEvents();
    }
}

// Applications
let currentEditAppId = null;

function openAddApplicationModal() {
    currentEditAppId = null;
    document.getElementById('application-form').reset();
    document.getElementById('application-modal-title').textContent = 'Добавить заявку';
    openModal('application-modal');
}

async function editApplication(id) {
    const app = (await dataManager.getApplications()).find(a => a.id === id);
    if (!app) return;

    currentEditAppId = id;
    document.getElementById('application-name').value = app.name;
    document.getElementById('application-desc').value = app.description;
    document.getElementById('application-url').value = app.url;
    document.getElementById('application-modal-title').textContent = 'Редактировать заявку';
    openModal('application-modal');
}

async function saveApplication() {
    const name = document.getElementById('application-name').value.trim();
    const description = document.getElementById('application-desc').value.trim();
    const url = document.getElementById('application-url').value.trim();

    if (!name || !url) {
        alert('Заполните название и ссылку');
        return;
    }

    if (currentEditAppId) {
        await dataManager.updateApplication(currentEditAppId, { name, description, url });
    } else {
        await dataManager.addApplication({ name, description, url });
    }

    closeModal('application-modal');
    renderAdminApplications();
}

async function deleteApplication(id) {
    if (confirm('Удалить эту заявку?')) {
        await dataManager.deleteApplication(id);
        renderAdminApplications();
    }
}

// Contacts
let currentEditContactId = null;

function openAddContactModal() {
    currentEditContactId = null;
    document.getElementById('contact-form').reset();
    document.getElementById('contact-modal-title').textContent = 'Добавить контакт';
    openModal('contact-modal');
}

async function editContact(id) {
    const contact = (await dataManager.getContacts()).find(c => c.id === id);
    if (!contact) return;

    currentEditContactId = id;
    document.getElementById('contact-name').value = contact.name;
    document.getElementById('contact-position').value = contact.position;
    document.getElementById('contact-department').value = contact.department;
    document.getElementById('contact-phone').value = contact.phone;
    document.getElementById('contact-email').value = contact.email;
    document.getElementById('contact-modal-title').textContent = 'Редактировать контакт';
    openModal('contact-modal');
}

async function saveContact() {
    const name = document.getElementById('contact-name').value.trim();
    const position = document.getElementById('contact-position').value.trim();
    const department = document.getElementById('contact-department').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();

    if (!name || !position) {
        alert('Заполните ФИО и должность');
        return;
    }

    if (currentEditContactId) {
        await dataManager.updateContact(currentEditContactId, { name, position, department, phone, email });
    } else {
        await dataManager.addContact({ name, position, department, phone, email });
    }

    closeModal('contact-modal');
    renderAdminContacts();
}

async function deleteContact(id) {
    if (confirm('Удалить этот контакт?')) {
        await dataManager.deleteContact(id);
        renderAdminContacts();
    }
}

// FAQ
let currentEditFaqId = null;

function openAddFaqModal() {
    currentEditFaqId = null;
    document.getElementById('faq-form').reset();
    document.getElementById('faq-modal-title').textContent = 'Добавить FAQ';
    openModal('faq-modal');
}

async function editFaq(id) {
    const faq = (await dataManager.getFaq()).find(f => f.id === id);
    if (!faq) return;

    currentEditFaqId = id;
    document.getElementById('faq-question').value = faq.question;
    document.getElementById('faq-answer').value = faq.answer;
    document.getElementById('faq-modal-title').textContent = 'Редактировать FAQ';
    openModal('faq-modal');
}

async function saveFaq() {
    const question = document.getElementById('faq-question').value.trim();
    const answer = document.getElementById('faq-answer').value.trim();

    if (!question || !answer) {
        alert('Заполните вопрос и ответ');
        return;
    }

    if (currentEditFaqId) {
        await dataManager.updateFaq(currentEditFaqId, { question, answer });
    } else {
        await dataManager.addFaq({ question, answer });
    }

    closeModal('faq-modal');
    renderAdminFaq();
}

async function deleteFaq(id) {
    if (confirm('Удалить этот FAQ?')) {
        await dataManager.deleteFaq(id);
        renderAdminFaq();
    }
}

// ============================================
// Helpdesk Form
// ============================================

function submitHelpdeskRequest(event) {
    event.preventDefault();
    
    const name = document.getElementById('helpdesk-name').value.trim();
    const email = document.getElementById('helpdesk-email').value.trim();
    const category = document.getElementById('helpdesk-category').value;
    const description = document.getElementById('helpdesk-description').value.trim();

    if (!name || !email || !category || !description) {
        alert('Заполните все поля');
        return;
    }

    // В реальном приложении здесь был бы AJAX запрос
    alert(`Заявка отправлена!\n\nИмя: ${name}\nEmail: ${email}\nКатегория: ${category}\n\nМы свяжемся с вами в ближайшее время.`);
    
    document.getElementById('helpdesk-form').reset();
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    
    // Initialize page-specific content
    if (document.getElementById('news-list')) {
        renderNews();
    }
    if (document.getElementById('events-list')) {
        renderEvents();
    }
    if (document.getElementById('applications-grid')) {
        renderApplications();
    }
    if (document.getElementById('contacts-table')) {
        renderContacts();
    }
    if (document.getElementById('faq-list')) {
        renderFaq();
    }
    if (document.getElementById('manuals-list')) {
        renderManuals();
    }
    
    // Admin panel
    if (document.querySelector('.admin-tabs')) {
        renderAdminNews();
    }
});
