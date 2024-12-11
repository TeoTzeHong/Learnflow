// Notices page functionality

class NoticesManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.noticeCards = document.querySelectorAll('.notice-card');
        this.detailButtons = document.querySelectorAll('.details-btn');
        this.toolButtons = document.querySelectorAll('.tool-btn');
        
        this.init();
    }

    init() {
        // Initialize filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Initialize detail buttons
        this.detailButtons.forEach(button => {
            button.addEventListener('click', (e) => this.showNoticeDetails(e));
        });

        // Initialize teacher tools
        this.toolButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleToolAction(e));
        });

        // Load saved notices
        this.loadNotices();
    }

    loadNotices() {
        const savedNotices = localStorage.getItem('notices');
        if (savedNotices) {
            const notices = JSON.parse(savedNotices);
            const noticesGrid = document.querySelector('.notices-grid');
            
            // Clear existing notices
            noticesGrid.innerHTML = '';
            
            // Add saved notices
            notices.forEach(notice => {
                const noticeCard = document.createElement('div');
                noticeCard.className = `notice-card ${notice.type}`;
                noticeCard.innerHTML = `
                    <div class="notice-header">
                        <span class="notice-tag ${notice.type}">${this.capitalizeFirst(notice.type)}</span>
                        <span class="notice-date">${notice.date}</span>
                    </div>
                    <h3>${notice.title}</h3>
                    <p>${notice.content}</p>
                    <div class="notice-footer">
                        <button class="details-btn">View Details</button>
                    </div>
                `;

                // Add event listener to the details button
                noticeCard.querySelector('.details-btn').addEventListener('click', (e) => {
                    this.showNoticeDetails(e);
                });

                noticesGrid.appendChild(noticeCard);
            });
        }
    }

    handleFilter(e) {
        // Remove active class from all buttons
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        
        // Show/hide notices based on filter
        this.noticeCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                if (card.classList.contains(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    showNoticeDetails(e) {
        const noticeCard = e.target.closest('.notice-card');
        const title = noticeCard.querySelector('h3').textContent;
        const content = noticeCard.querySelector('p').textContent;
        const type = noticeCard.className.split(' ')[1];
        const date = noticeCard.dataset.rawDate;
        
        const modal = document.createElement('div');
        modal.className = 'notice-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${title}</h2>
                <div class="notice-content">
                    <p>${content}</p>
                    <div class="additional-content">
                        <h4>Additional Information</h4>
                        <p>More details about this notice will be displayed here...</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    <button class="close-btn">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add action handlers
        const closeBtn = modal.querySelector('.close-btn');
        const editBtn = modal.querySelector('.edit-btn');
        const deleteBtn = modal.querySelector('.delete-btn');

        closeBtn.addEventListener('click', () => modal.remove());
        editBtn.addEventListener('click', () => {
            modal.remove();
            this.showEditNoticeForm(noticeCard, { title, content, type, date });
        });
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this notice?')) {
                noticeCard.remove();
                this.saveNotices();
                modal.remove();
                this.showNotification('Notice deleted successfully!');
            }
        });
    }

    showEditNoticeForm(noticeCard, noticeData) {
        const modal = document.createElement('div');
        modal.className = 'notice-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Notice</h2>
                <form id="editNoticeForm">
                    <select name="noticeType" id="noticeType" required>
                        <option value="academic" ${noticeData.type === 'academic' ? 'selected' : ''}>Academic</option>
                        <option value="events" ${noticeData.type === 'events' ? 'selected' : ''}>Event</option>
                        <option value="parents" ${noticeData.type === 'parents' ? 'selected' : ''}>Parent Notice</option>
                    </select>
                    <input type="text" id="noticeTitle" placeholder="Notice Title" required value="${noticeData.title}">
                    <textarea id="noticeContent" placeholder="Notice Content" required>${noticeData.content}</textarea>
                    <input type="date" id="noticeDate" required value="${noticeData.date.split('T')[0]}">
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="submit-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Add form handlers
        const form = modal.querySelector('form');
        const cancelBtn = modal.querySelector('.cancel-btn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const type = document.getElementById('noticeType').value;
            const title = document.getElementById('noticeTitle').value;
            const content = document.getElementById('noticeContent').value;
            const date = document.getElementById('noticeDate').value;

            if (!type || !title.trim() || !content.trim() || !date) {
                this.showNotification('Please fill in all fields', 'error');
                return;
            }

            // Update the notice card
            noticeCard.className = `notice-card ${type}`;
            noticeCard.dataset.rawDate = new Date(date).toISOString();
            noticeCard.innerHTML = `
                <div class="notice-header">
                    <span class="notice-tag ${type}">${this.capitalizeFirst(type)}</span>
                    <span class="notice-date">${this.formatDate(date)}</span>
                </div>
                <h3>${title}</h3>
                <p>${content}</p>
                <div class="notice-footer">
                    <button class="details-btn">View Details</button>
                </div>
            `;

            // Reattach event listener
            noticeCard.querySelector('.details-btn').addEventListener('click', (e) => {
                this.showNoticeDetails(e);
            });

            this.saveNotices();
            modal.remove();
            this.showNotification('Notice updated successfully!');
        });

        cancelBtn.addEventListener('click', () => modal.remove());
    }

    handleToolAction(e) {
        const action = e.target.closest('.tool-btn').textContent.trim();
        
        switch(action) {
            case 'Create Notice':
                this.showCreateNoticeForm();
                break;
            case 'Upload Resources':
                this.showResourceUploader();
                break;
            case 'Send Messages':
                this.showMessageComposer();
                break;
            case 'View Analytics':
                this.showAnalytics();
                break;
        }
    }

    showCreateNoticeForm() {
        const modal = document.createElement('div');
        modal.className = 'notice-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Create New Notice</h2>
                <form id="noticeForm">
                    <select name="noticeType" id="noticeType" required>
                        <option value="">Select Notice Type</option>
                        <option value="academic">Academic</option>
                        <option value="events">Event</option>
                        <option value="parents">Parent Notice</option>
                    </select>
                    <input type="text" id="noticeTitle" placeholder="Notice Title" required>
                    <textarea id="noticeContent" placeholder="Notice Content" required></textarea>
                    <input type="date" id="noticeDate" required>
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="submit-btn">Create Notice</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Add form handlers
        const form = modal.querySelector('form');
        const cancelBtn = modal.querySelector('.cancel-btn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const type = document.getElementById('noticeType').value;
            const title = document.getElementById('noticeTitle').value;
            const content = document.getElementById('noticeContent').value;
            const date = document.getElementById('noticeDate').value;

            if (!type || !title.trim() || !content.trim() || !date) {
                this.showNotification('Please fill in all fields', 'error');
                return;
            }

            const noticeCard = document.createElement('div');
            noticeCard.className = `notice-card ${type}`;
            noticeCard.dataset.rawDate = new Date(date).toISOString(); // Store original date
            noticeCard.innerHTML = `
                <div class="notice-header">
                    <span class="notice-tag ${type}">${this.capitalizeFirst(type)}</span>
                    <span class="notice-date">${this.formatDate(date)}</span>
                </div>
                <h3>${title}</h3>
                <p>${content}</p>
                <div class="notice-footer">
                    <button class="details-btn">View Details</button>
                </div>
            `;

            // Add event listener to the new details button
            noticeCard.querySelector('.details-btn').addEventListener('click', (e) => {
                this.showNoticeDetails(e);
            });

            const noticesGrid = document.querySelector('.notices-grid');
            noticesGrid.insertBefore(noticeCard, noticesGrid.firstChild);

            this.saveNotices();
            modal.remove();
            this.showNotification('Notice created successfully!');
        });

        cancelBtn.addEventListener('click', () => modal.remove());
    }

    showResourceUploader() {
        alert('Resource uploader will be implemented here');
    }

    showMessageComposer() {
        alert('Message composer will be implemented here');
    }

    showAnalytics() {
        alert('Analytics dashboard will be implemented here');
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Update notification styles
        if (!document.querySelector('#notification-style')) {
            const style = document.createElement('style');
            style.id = 'notification-style';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 25px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    animation: slideIn 0.5s ease-out;
                    z-index: 1000;
                }
                .notification.success {
                    background: var(--secondary-color);
                    color: white;
                }
                .notification.error {
                    background: #ff4444;
                    color: white;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => notification.remove(), 3000);
    }

    saveNotices() {
        const noticesGrid = document.querySelector('.notices-grid');
        const notices = Array.from(noticesGrid.children).map(notice => ({
            type: notice.className.split(' ')[1],
            title: notice.querySelector('h3').textContent,
            content: notice.querySelector('p').textContent,
            date: notice.querySelector('.notice-date').textContent,
            rawDate: notice.dataset.rawDate || new Date().toISOString() // Store original date for sorting
        }));

        // Sort notices by date (newest first)
        notices.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
        
        localStorage.setItem('notices', JSON.stringify(notices));
    }
}

// Add modal styles
const style = document.createElement('style');
style.textContent = `
    .notice-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }

    .modal-content h2 {
        color: var(--primary-color);
        margin-bottom: 20px;
    }

    #noticeForm {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    #noticeForm input,
    #noticeForm select,
    #noticeForm textarea {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-family: inherit;
    }

    #noticeForm textarea {
        min-height: 150px;
        resize: vertical;
    }

    .form-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .form-buttons button {
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .cancel-btn {
        background: #f5f5f5;
    }

    .submit-btn {
        background: var(--primary-color);
        color: white;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .modal-actions button {
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .edit-btn {
        background: var(--primary-color);
        color: white;
    }

    .delete-btn {
        background: #ff4444;
        color: white;
    }

    .close-btn {
        background: #f5f5f5;
        color: var(--text-color);
    }

    .edit-btn:hover {
        background: #357ABD;
    }

    .delete-btn:hover {
        background: #ff1111;
    }

    .close-btn:hover {
        background: #e0e0e0;
    }
`;
document.head.appendChild(style);

// Initialize notices manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const noticesManager = new NoticesManager();
}); 