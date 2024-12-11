// Homework page functionality

class HomeworkAssistant {
    constructor() {
        // Question section elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.submitBtn = document.querySelector('.submit-btn');
        this.textarea = document.querySelector('.input-area textarea');

        // Task section elements
        this.taskList = document.querySelector('.task-list');
        this.addTaskBtn = document.querySelector('.add-task-btn');

        // Study tips elements
        this.tips = document.querySelectorAll('.tip');
        this.prevTipBtn = document.querySelector('.prev-tip');
        this.nextTipBtn = document.querySelector('.next-tip');
        this.currentTipIndex = 0;

        this.init();
    }

    init() {
        // Initialize file upload handlers
        this.initializeFileUpload();

        // Initialize task handlers
        this.initializeTaskHandlers();

        // Initialize tips carousel
        this.initializeTipsCarousel();

        // Load saved tasks
        this.loadTasks();
    }

    initializeFileUpload() {
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = 'var(--primary-color)';
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.style.borderColor = '#ddd';
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFileUpload(file);
            }
        });

        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        });

        this.submitBtn.addEventListener('click', () => this.handleSubmission());
    }

    handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create preview or handle the file
            this.uploadArea.innerHTML = `
                <img src="${e.target.result}" alt="Uploaded homework" style="max-width: 100%; max-height: 200px;">
                <p>Click to change image</p>
            `;
        };
        reader.readAsDataURL(file);
    }

    handleSubmission() {
        const question = this.textarea.value.trim();
        if (!question) {
            alert('Please enter your question or upload an image');
            return;
        }

        // Simulate AI response
        setTimeout(() => {
            alert('Your question has been received. An AI assistant will help you shortly.');
            this.textarea.value = '';
            this.uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop image here or click to upload</p>
            `;
        }, 1000);
    }

    initializeTaskHandlers() {
        this.addTaskBtn.addEventListener('click', () => this.showAddTaskModal());
        
        // Handle task checkbox changes
        this.taskList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const taskItem = e.target.closest('.task-item');
                if (e.target.checked) {
                    taskItem.style.opacity = '0.5';
                } else {
                    taskItem.style.opacity = '1';
                }
                this.saveTasks();
            }
        });
    }

    showAddTaskModal() {
        // Check if form already exists
        if (document.querySelector('.add-task-form')) return;

        const taskForm = document.createElement('div');
        taskForm.className = 'add-task-form';
        taskForm.innerHTML = `
            <h3>Add New Task</h3>
            <form id="taskForm">
                <input type="text" id="taskInput" placeholder="Task description" required>
                <select id="prioritySelect" required>
                    <option value="">Select Priority</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                </select>
                <input type="date" id="dueDateInput" required>
                <div class="form-buttons">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="save-btn">Save Task</button>
                </div>
            </form>
        `;

        // Insert form before the task list
        this.taskList.parentNode.insertBefore(taskForm, this.taskList);

        // Add form handlers
        const form = taskForm.querySelector('form');
        const cancelBtn = taskForm.querySelector('.cancel-btn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewTask(taskForm);
        });

        cancelBtn.addEventListener('click', () => taskForm.remove());
    }

    addNewTask(modal) {
        const taskInput = modal.querySelector('#taskInput');
        const prioritySelect = modal.querySelector('#prioritySelect');
        const dueDateInput = modal.querySelector('#dueDateInput');

        if (!taskInput.value.trim()) {
            alert('Please enter a task description');
            return;
        }

        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        const formattedDate = this.formatDateForDisplay(dueDateInput.value);
        
        taskItem.innerHTML = `
            <input type="checkbox" id="task${Date.now()}">
            <label for="task${Date.now()}">${taskInput.value} - Due ${formattedDate}</label>
            <span class="priority ${prioritySelect.value}">${prioritySelect.value}</span>
            <div class="task-actions">
                <button class="edit-task-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-task-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Add event listeners for edit and delete buttons
        const editBtn = taskItem.querySelector('.edit-task-btn');
        const deleteBtn = taskItem.querySelector('.delete-task-btn');

        editBtn.addEventListener('click', () => this.editTask(taskItem));
        deleteBtn.addEventListener('click', () => this.deleteTask(taskItem));

        this.taskList.appendChild(taskItem);
        this.saveTasks();
        modal.remove();
    }

    editTask(taskItem) {
        const label = taskItem.querySelector('label');
        const priority = taskItem.querySelector('.priority');
        const [taskText, dueDate] = label.textContent.split(' - Due ');

        const modal = document.createElement('div');
        modal.className = 'task-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Edit Task</h3>
                <form id="editTaskForm">
                    <input type="text" id="taskInput" value="${taskText.trim()}" required>
                    <select id="prioritySelect" required>
                        <option value="high" ${priority.classList.contains('high') ? 'selected' : ''}>High Priority</option>
                        <option value="medium" ${priority.classList.contains('medium') ? 'selected' : ''}>Medium Priority</option>
                        <option value="low" ${priority.classList.contains('low') ? 'selected' : ''}>Low Priority</option>
                    </select>
                    <input type="date" id="dueDateInput" value="${this.formatDateForInput(dueDate.trim())}" required>
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('form');
        const cancelBtn = modal.querySelector('.cancel-btn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTaskText = modal.querySelector('#taskInput').value;
            const newPriority = modal.querySelector('#prioritySelect').value;
            const newDueDate = modal.querySelector('#dueDateInput').value;

            label.textContent = `${newTaskText} - Due ${this.formatDateForDisplay(newDueDate)}`;
            priority.className = `priority ${newPriority}`;
            priority.textContent = newPriority;

            this.saveTasks();
            modal.remove();
        });

        cancelBtn.addEventListener('click', () => modal.remove());
    }

    deleteTask(taskItem) {
        if (confirm('Are you sure you want to delete this task?')) {
            taskItem.remove();
            this.saveTasks();
        }
    }

    saveTasks() {
        const tasks = [];
        this.taskList.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('label').textContent,
                checked: item.querySelector('input').checked,
                priority: item.querySelector('.priority').className.split(' ')[1]
            });
        });
        localStorage.setItem('homework-tasks', JSON.stringify(tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('homework-tasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            this.taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.style.opacity = task.checked ? '0.5' : '1';
                
                // Extract task text and due date
                const [taskText, dueDate] = task.text.split(' - Due ');
                
                taskItem.innerHTML = `
                    <input type="checkbox" id="task${Date.now()}" ${task.checked ? 'checked' : ''}>
                    <label for="task${Date.now()}">${taskText} - Due ${dueDate}</label>
                    <span class="priority ${task.priority}">${task.priority}</span>
                    <div class="task-actions">
                        <button class="edit-task-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-task-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;

                // Add event listeners for edit and delete buttons
                const editBtn = taskItem.querySelector('.edit-task-btn');
                const deleteBtn = taskItem.querySelector('.delete-task-btn');

                editBtn.addEventListener('click', () => this.editTask(taskItem));
                deleteBtn.addEventListener('click', () => this.deleteTask(taskItem));

                this.taskList.appendChild(taskItem);
            });
        }
    }

    initializeTipsCarousel() {
        this.showTip(this.currentTipIndex);

        this.prevTipBtn.addEventListener('click', () => {
            this.currentTipIndex = (this.currentTipIndex - 1 + this.tips.length) % this.tips.length;
            this.showTip(this.currentTipIndex);
        });

        this.nextTipBtn.addEventListener('click', () => {
            this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
            this.showTip(this.currentTipIndex);
        });

        // Auto-rotate tips every 5 seconds
        setInterval(() => {
            this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
            this.showTip(this.currentTipIndex);
        }, 5000);
    }

    showTip(index) {
        this.tips.forEach(tip => tip.classList.remove('active'));
        this.tips[index].classList.add('active');
    }

    formatDateForInput(dateStr) {
        // Convert display date format to YYYY-MM-DD for input
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    }

    formatDateForDisplay(dateStr) {
        // Convert YYYY-MM-DD to display format
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize the homework assistant when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const homeworkAssistant = new HomeworkAssistant();
});

// Add this CSS to the existing style element or create a new one:
const taskFormStyle = document.createElement('style');
taskFormStyle.textContent = `
    .add-task-form {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: var(--shadow);
        margin-bottom: 20px;
    }

    .add-task-form h3 {
        color: var(--primary-color);
        margin-bottom: 15px;
    }

    #taskForm {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    #taskForm input,
    #taskForm select {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-family: inherit;
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
        transition: background-color 0.3s ease;
    }

    .cancel-btn {
        background: #f5f5f5;
        color: var(--text-color);
    }

    .cancel-btn:hover {
        background: #e0e0e0;
    }

    .save-btn {
        background: var(--secondary-color);
        color: white;
    }

    .save-btn:hover {
        background: #27ae60;
    }
`;
document.head.appendChild(taskFormStyle); 