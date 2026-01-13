/* ============================================
   БСО Корпоративный Портал - JavaScript
   Строительная компания БСО (bso-cc.ru)
   Москва, Ленинский пр., д. 11, стр. 2
   ============================================ */

// Инициализация данных по умолчанию
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
            url: 'forms/Заявка16.html'
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
// Data Management
// ============================================

class DataManager {
    constructor() {
        this.storageKey = 'bso_portal_data';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_DATA));
        }
    }

    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : DEFAULT_DATA;
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // News
    getNews() {
        return this.getData().news || [];
    }

    addNews(news) {
        const data = this.getData();
        news.id = Date.now();
        data.news.unshift(news);
        this.saveData(data);
        return news;
    }

    updateNews(id, updatedNews) {
        const data = this.getData();
        const index = data.news.findIndex(n => n.id === id);
        if (index !== -1) {
            data.news[index] = { ...data.news[index], ...updatedNews };
            this.saveData(data);
        }
    }

    deleteNews(id) {
        const data = this.getData();
        data.news = data.news.filter(n => n.id !== id);
        this.saveData(data);
    }

    // Events
    getEvents() {
        return this.getData().events || [];
    }

    addEvent(event) {
        const data = this.getData();
        event.id = Date.now();
        data.events.unshift(event);
        this.saveData(data);
        return event;
    }

    updateEvent(id, updatedEvent) {
        const data = this.getData();
        const index = data.events.findIndex(e => e.id === id);
        if (index !== -1) {
            data.events[index] = { ...data.events[index], ...updatedEvent };
            this.saveData(data);
        }
    }

    deleteEvent(id) {
        const data = this.getData();
        data.events = data.events.filter(e => e.id !== id);
        this.saveData(data);
    }

    // Applications
    getApplications() {
        return this.getData().applications || [];
    }

    addApplication(app) {
        const data = this.getData();
        app.id = Date.now();
        data.applications.push(app);
        this.saveData(data);
        return app;
    }

    updateApplication(id, updatedApp) {
        const data = this.getData();
        const index = data.applications.findIndex(a => a.id === id);
        if (index !== -1) {
            data.applications[index] = { ...data.applications[index], ...updatedApp };
            this.saveData(data);
        }
    }

    deleteApplication(id) {
        const data = this.getData();
        data.applications = data.applications.filter(a => a.id !== id);
        this.saveData(data);
    }

    // Contacts
    getContacts() {
        return this.getData().contacts || [];
    }

    addContact(contact) {
        const data = this.getData();
        contact.id = Date.now();
        data.contacts.push(contact);
        this.saveData(data);
        return contact;
    }

    updateContact(id, updatedContact) {
        const data = this.getData();
        const index = data.contacts.findIndex(c => c.id === id);
        if (index !== -1) {
            data.contacts[index] = { ...data.contacts[index], ...updatedContact };
            this.saveData(data);
        }
    }

    deleteContact(id) {
        const data = this.getData();
        data.contacts = data.contacts.filter(c => c.id !== id);
        this.saveData(data);
    }

    // FAQ
    getFaq() {
        return this.getData().faq || [];
    }

    addFaq(faq) {
        const data = this.getData();
        faq.id = Date.now();
        data.faq.push(faq);
        this.saveData(data);
        return faq;
    }

    updateFaq(id, updatedFaq) {
        const data = this.getData();
        const index = data.faq.findIndex(f => f.id === id);
        if (index !== -1) {
            data.faq[index] = { ...data.faq[index], ...updatedFaq };
            this.saveData(data);
        }
    }

    deleteFaq(id) {
        const data = this.getData();
        data.faq = data.faq.filter(f => f.id !== id);
        this.saveData(data);
    }

    // Manuals
    getManuals() {
        return this.getData().manuals || [];
    }

    addManual(manual) {
        const data = this.getData();
        manual.id = Date.now();
        data.manuals.push(manual);
        this.saveData(data);
        return manual;
    }

    deleteManual(id) {
        const data = this.getData();
        data.manuals = data.manuals.filter(m => m.id !== id);
        this.saveData(data);
    }

    // Reset to defaults
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
function renderNews(containerId = 'news-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const news = dataManager.getNews();
    
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
function renderEvents(containerId = 'events-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const events = dataManager.getEvents();
    
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
function renderApplications(containerId = 'applications-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const applications = dataManager.getApplications();
    
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
function renderContacts(containerId = 'contacts-table') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const contacts = dataManager.getContacts();
    
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
function renderFaq(containerId = 'faq-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const faq = dataManager.getFaq();
    
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

function renderAdminNews() {
    const container = document.getElementById('admin-news-list');
    if (!container) return;

    const news = dataManager.getNews();
    
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

function renderAdminEvents() {
    const container = document.getElementById('admin-events-list');
    if (!container) return;

    const events = dataManager.getEvents();
    
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

function renderAdminApplications() {
    const container = document.getElementById('admin-applications-list');
    if (!container) return;

    const applications = dataManager.getApplications();
    
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

function renderAdminContacts() {
    const container = document.getElementById('admin-contacts-list');
    if (!container) return;

    const contacts = dataManager.getContacts();
    
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

function renderAdminFaq() {
    const container = document.getElementById('admin-faq-list');
    if (!container) return;

    const faq = dataManager.getFaq();
    
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

function editNews(id) {
    const news = dataManager.getNews().find(n => n.id === id);
    if (!news) return;

    currentEditNewsId = id;
    document.getElementById('news-title').value = news.title;
    document.getElementById('news-date').value = news.date;
    document.getElementById('news-text').value = news.text;
    document.getElementById('news-modal-title').textContent = 'Редактировать новость';
    openModal('news-modal');
}

function saveNews() {
    const title = document.getElementById('news-title').value.trim();
    const date = document.getElementById('news-date').value;
    const text = document.getElementById('news-text').value.trim();

    if (!title || !date || !text) {
        alert('Заполните все поля');
        return;
    }

    if (currentEditNewsId) {
        dataManager.updateNews(currentEditNewsId, { title, date, text });
    } else {
        dataManager.addNews({ title, date, text });
    }

    closeModal('news-modal');
    renderAdminNews();
}

function deleteNews(id) {
    if (confirm('Удалить эту новость?')) {
        dataManager.deleteNews(id);
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

function editEvent(id) {
    const event = dataManager.getEvents().find(e => e.id === id);
    if (!event) return;

    currentEditEventId = id;
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-text').value = event.text;
    document.getElementById('event-modal-title').textContent = 'Редактировать событие';
    openModal('event-modal');
}

function saveEvent() {
    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value;
    const text = document.getElementById('event-text').value.trim();

    if (!title || !date || !text) {
        alert('Заполните все поля');
        return;
    }

    if (currentEditEventId) {
        dataManager.updateEvent(currentEditEventId, { title, date, text });
    } else {
        dataManager.addEvent({ title, date, text });
    }

    closeModal('event-modal');
    renderAdminEvents();
}

function deleteEvent(id) {
    if (confirm('Удалить это событие?')) {
        dataManager.deleteEvent(id);
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

function editApplication(id) {
    const app = dataManager.getApplications().find(a => a.id === id);
    if (!app) return;

    currentEditAppId = id;
    document.getElementById('application-name').value = app.name;
    document.getElementById('application-desc').value = app.description;
    document.getElementById('application-url').value = app.url;
    document.getElementById('application-modal-title').textContent = 'Редактировать заявку';
    openModal('application-modal');
}

function saveApplication() {
    const name = document.getElementById('application-name').value.trim();
    const description = document.getElementById('application-desc').value.trim();
    const url = document.getElementById('application-url').value.trim();

    if (!name || !url) {
        alert('Заполните название и ссылку');
        return;
    }

    if (currentEditAppId) {
        dataManager.updateApplication(currentEditAppId, { name, description, url });
    } else {
        dataManager.addApplication({ name, description, url });
    }

    closeModal('application-modal');
    renderAdminApplications();
}

function deleteApplication(id) {
    if (confirm('Удалить эту заявку?')) {
        dataManager.deleteApplication(id);
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

function editContact(id) {
    const contact = dataManager.getContacts().find(c => c.id === id);
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

function saveContact() {
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
        dataManager.updateContact(currentEditContactId, { name, position, department, phone, email });
    } else {
        dataManager.addContact({ name, position, department, phone, email });
    }

    closeModal('contact-modal');
    renderAdminContacts();
}

function deleteContact(id) {
    if (confirm('Удалить этот контакт?')) {
        dataManager.deleteContact(id);
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

function editFaq(id) {
    const faq = dataManager.getFaq().find(f => f.id === id);
    if (!faq) return;

    currentEditFaqId = id;
    document.getElementById('faq-question').value = faq.question;
    document.getElementById('faq-answer').value = faq.answer;
    document.getElementById('faq-modal-title').textContent = 'Редактировать FAQ';
    openModal('faq-modal');
}

function saveFaq() {
    const question = document.getElementById('faq-question').value.trim();
    const answer = document.getElementById('faq-answer').value.trim();

    if (!question || !answer) {
        alert('Заполните вопрос и ответ');
        return;
    }

    if (currentEditFaqId) {
        dataManager.updateFaq(currentEditFaqId, { question, answer });
    } else {
        dataManager.addFaq({ question, answer });
    }

    closeModal('faq-modal');
    renderAdminFaq();
}

function deleteFaq(id) {
    if (confirm('Удалить этот FAQ?')) {
        dataManager.deleteFaq(id);
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
