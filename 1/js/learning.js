// Learning page functionality

class LearningManager {
    constructor() {
        this.startButtons = document.querySelectorAll('.start-btn');
        this.questions = {
            mathematics: {
                question: "Solve the quadratic equation: 2x² + 5x - 12 = 0",
                options: [
                    "x = -4 or x = 1.5",
                    "x = 1.5 or x = -4",
                    "x = -3 or x = 2",
                    "x = 2 or x = -3"
                ],
                correct: 1,
                explanation: "Using the quadratic formula: x = [-5 ± √(25+96)] / 4 = [-5 ± √121] / 4 = [-5 ± 11] / 4, giving us x = 1.5 or x = -4"
            },
            science: {
                question: "What is the difference between mitosis and meiosis in cell division?",
                options: [
                    "Mitosis produces 4 cells, meiosis produces 2",
                    "Mitosis produces identical cells, meiosis produces genetically different cells",
                    "Mitosis is for growth, meiosis is for reproduction",
                    "Mitosis occurs in plants, meiosis in animals"
                ],
                correct: 2,
                explanation: "Mitosis is used for growth and repair, producing identical daughter cells. Meiosis is used for sexual reproduction, producing genetically diverse gametes."
            },
            literature: {
                question: "Analyze the theme of power in George Orwell's 'Animal Farm'",
                options: [
                    "Power leads to equality among all animals",
                    "Power corrupts, and absolute power corrupts absolutely",
                    "Power should be distributed equally",
                    "Power belongs to the strongest animals"
                ],
                correct: 1,
                explanation: "The novel demonstrates how power corrupts through the transformation of the pigs, especially Napoleon, who eventually becomes indistinguishable from the humans they originally rebelled against."
            },
            geography: {
                question: "Explain the formation of tectonic plates and their role in earthquakes",
                options: [
                    "Plates form from volcanic activity only",
                    "Plates are static and don't move",
                    "Plates form from the Earth's crust and uppermost mantle",
                    "Plates are man-made boundaries"
                ],
                correct: 2,
                explanation: "Tectonic plates are formed from the Earth's lithosphere (crust and uppermost mantle). Their movement and interaction at boundaries cause earthquakes."
            },
            physics: {
                question: "Calculate the acceleration of a 2kg object with 10N force applied",
                options: [
                    "2 m/s²",
                    "5 m/s²",
                    "8 m/s²",
                    "10 m/s²"
                ],
                correct: 1,
                explanation: "Using F = ma, we get: 10N = 2kg × a, therefore a = 10/2 = 5 m/s²"
            },
            english: {
                question: "Identify the sentence with the correctly placed modifier:",
                options: [
                    "Walking quickly, the bus was missed by John",
                    "John, walking quickly, missed the bus",
                    "The bus was missed by John walking quickly",
                    "Missed was the bus by John walking quickly"
                ],
                correct: 1,
                explanation: "The modifier 'walking quickly' should be next to the subject it modifies (John)."
            }
        };

        this.userProgress = JSON.parse(localStorage.getItem('learning-progress')) || {
            totalAttempts: 0,
            correctAnswers: 0,
            subjectProgress: {}
        };
        this.updateProgressDisplay();

        this.init();
    }

    init() {
        this.startButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.lesson-card');
                const subject = card.querySelector('h3').textContent.toLowerCase();
                this.showQuestionModal(subject);
            });
        });
    }

    updateProgressDisplay() {
        const dailyProgress = Math.round((this.userProgress.correctAnswers / Math.max(this.userProgress.totalAttempts, 1)) * 100);
        const dailyProgressBar = document.querySelector('.progress-card:first-child .progress');
        dailyProgressBar.style.width = `${dailyProgress}%`;
        dailyProgressBar.textContent = `${dailyProgress}%`;

        // Calculate weekly goals (5 questions per subject)
        const totalSubjects = Object.keys(this.questions).length;
        const weeklyGoal = totalSubjects * 5;
        const weeklyProgress = Math.round((this.userProgress.totalAttempts / weeklyGoal) * 100);
        const weeklyProgressBar = document.querySelector('.progress-card:last-child .progress');
        weeklyProgressBar.style.width = `${Math.min(weeklyProgress, 100)}%`;
        weeklyProgressBar.textContent = `${Math.min(weeklyProgress, 100)}%`;
    }

    showQuestionModal(subject) {
        const questionData = this.questions[subject];
        const modal = document.createElement('div');
        modal.className = 'question-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${subject.charAt(0).toUpperCase() + subject.slice(1)} Practice</h2>
                <div class="question-content">
                    <p class="question">${questionData.question}</p>
                    <form class="question-form">
                        <div class="options">
                            ${questionData.options.map((option, index) => `
                                <label class="option">
                                    <input type="radio" name="answer" value="${index}">
                                    <span class="option-text">${option}</span>
                                </label>
                            `).join('')}
                        </div>
                        <div class="feedback"></div>
                        <div class="modal-buttons">
                            <button type="submit" class="submit-btn">Submit Answer</button>
                            <button type="button" class="close-btn">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const form = modal.querySelector('.question-form');
        const closeBtn = modal.querySelector('.close-btn');
        const feedback = modal.querySelector('.feedback');
        const submitBtn = modal.querySelector('.submit-btn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selected = form.querySelector('input[name="answer"]:checked');
            
            if (!selected) {
                feedback.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Please select an answer</p>
                    </div>
                `;
                feedback.className = 'feedback visible error';
                return;
            }

            const selectedAnswer = parseInt(selected.value);
            const isCorrect = selectedAnswer === questionData.correct;
            
            // Update progress
            this.userProgress.totalAttempts++;
            if (isCorrect) {
                this.userProgress.correctAnswers++;
            }

            // Update subject-specific progress
            if (!this.userProgress.subjectProgress[subject]) {
                this.userProgress.subjectProgress[subject] = {
                    attempts: 0,
                    correct: 0
                };
            }
            this.userProgress.subjectProgress[subject].attempts++;
            if (isCorrect) {
                this.userProgress.subjectProgress[subject].correct++;
            }

            // Save progress
            localStorage.setItem('learning-progress', JSON.stringify(this.userProgress));
            this.updateProgressDisplay();

            // Show the selected answer and correct answer
            const options = modal.querySelectorAll('.option');
            options.forEach((option, index) => {
                option.classList.remove('correct', 'incorrect', 'selected');
                if (index === selectedAnswer) {
                    option.classList.add('selected');
                    option.classList.add(isCorrect ? 'correct' : 'incorrect');
                }
                if (index === questionData.correct) {
                    option.classList.add('correct');
                }
            });

            // Update the lesson card
            const card = document.querySelector(`.lesson-card h3:contains('${subject}')`).closest('.lesson-card');
            if (card) {
                const progress = this.userProgress.subjectProgress[subject];
                const accuracy = Math.round((progress.correct / progress.attempts) * 100);
                card.querySelector('.duration').textContent = `Attempts: ${progress.attempts} | Accuracy: ${accuracy}%`;
                if (progress.attempts >= 5) {
                    card.classList.add('completed');
                }
            }

            feedback.innerHTML = `
                <div class="${isCorrect ? 'correct' : 'incorrect'}">
                    <i class="fas fa-${isCorrect ? 'check' : 'times'}-circle"></i>
                    <p>${isCorrect ? 'Correct!' : 'Incorrect. The correct answer is: ' + questionData.options[questionData.correct]}</p>
                    <span class="score">Score: ${this.userProgress.correctAnswers}/${this.userProgress.totalAttempts}</span>
                </div>
                <div class="explanation">
                    <strong>Explanation:</strong> ${questionData.explanation}
                </div>
                <div class="progress-info">
                    <p>Subject Progress: ${this.userProgress.subjectProgress[subject].correct}/${this.userProgress.subjectProgress[subject].attempts} correct</p>
                </div>
            `;
            feedback.className = 'feedback visible';
            submitBtn.disabled = true;

            // Add a "Try Another" button after submission
            const tryAnotherBtn = document.createElement('button');
            tryAnotherBtn.className = 'try-another-btn';
            tryAnotherBtn.textContent = 'Try Another Question';
            tryAnotherBtn.onclick = () => {
                modal.remove();
                this.showQuestionModal(subject);
            };
            modal.querySelector('.modal-buttons').appendChild(tryAnotherBtn);
        });

        closeBtn.addEventListener('click', () => modal.remove());
    }
}

// Add styles for the question modal
const style = document.createElement('style');
style.textContent = `
    .question-modal {
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

    .question-modal .modal-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }

    .question {
        font-size: 1.1rem;
        margin-bottom: 20px;
        color: var(--text-color);
    }

    .options {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .option:hover {
        background: #f5f7fa;
    }

    .feedback {
        margin: 20px 0;
        padding: 15px;
        border-radius: 5px;
        display: none;
    }

    .feedback.visible {
        display: block;
    }

    .feedback.error {
        background: #ffe5e5;
        color: #ff4444;
        display: block;
    }

    .feedback .correct {
        color: #2ecc71;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .feedback .incorrect {
        color: #e74c3c;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .explanation {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        color: var(--text-color);
    }

    .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .modal-buttons button {
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .submit-btn {
        background: var(--primary-color);
        color: white;
    }

    .submit-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .close-btn {
        background: #f5f5f5;
    }

    .score {
        margin-left: auto;
        font-weight: bold;
    }

    .progress-info {
        margin-top: 15px;
        padding: 10px;
        background: #f5f7fa;
        border-radius: 5px;
    }

    .lesson-card.completed {
        border: 2px solid var(--secondary-color);
    }

    .lesson-card.completed .lesson-icon {
        background: var(--secondary-color);
    }

    .feedback .correct,
    .feedback .incorrect {
        padding: 10px;
        border-radius: 5px;
        background: #f0fff0;
        margin-bottom: 10px;
    }

    .feedback .incorrect {
        background: #fff0f0;
    }

    .option.correct {
        background: #e8f8e8;
        border-color: #2ecc71;
    }

    .option.incorrect {
        background: #ffe5e5;
        border-color: #e74c3c;
    }

    .option.selected {
        border-width: 2px;
    }

    .try-another-btn {
        background: var(--secondary-color);
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 10px;
    }

    .try-another-btn:hover {
        background: #27ae60;
    }

    .feedback i {
        font-size: 1.2rem;
    }

    .feedback .error {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #ff4444;
    }
`;
document.head.appendChild(style);

// Initialize learning manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const learningManager = new LearningManager();
}); 