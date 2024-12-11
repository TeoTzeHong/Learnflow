// Authentication handling for LearnFlow

class Auth {
    constructor() {
        this.isLoggedIn = false;
        this.user = null;
        this.loginBtn = document.getElementById('loginBtn');
        this.userProfile = document.querySelector('.user-profile');
        this.username = document.querySelector('.username');
        
        this.init();
    }

    init() {
        // Check if user is already logged in (from localStorage)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.isLoggedIn = true;
            this.updateUI();
        }

        // Add event listeners
        this.loginBtn.addEventListener('click', () => {
            if (this.isLoggedIn) {
                this.logout();
            } else {
                this.showLoginModal();
            }
        });
    }

    showLoginModal() {
        // Simulate login for demo purposes
        this.login({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'images/default-avatar.png'
        });
    }

    login(userData) {
        this.user = userData;
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(userData));
        this.updateUI();
    }

    logout() {
        this.user = null;
        this.isLoggedIn = false;
        localStorage.removeItem('user');
        this.updateUI();
    }

    updateUI() {
        if (this.isLoggedIn) {
            this.loginBtn.classList.add('hidden');
            this.userProfile.classList.remove('hidden');
            this.username.textContent = this.user.name;
        } else {
            this.loginBtn.classList.remove('hidden');
            this.userProfile.classList.add('hidden');
            this.loginBtn.textContent = 'Login';
        }
    }
}

// Initialize authentication
const auth = new Auth();