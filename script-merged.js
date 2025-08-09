class AuthManager {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setup3DBackground();
        this.setupMatrixEffect();
        this.setupCursorFollower();
        this.setupFloatingCodeAnimation();
    }

    init() {
        this.container = document.getElementById('container');
        this.registerBtn = document.getElementById('registerBtn');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.currentForm = 'login';
        
        console.log('AuthManager initialized');
        console.log('Elements found:', {
            container: !!this.container,
            registerBtn: !!this.registerBtn,
            loginBtn: !!this.loginBtn,
            loginForm: !!this.loginForm,
            registerForm: !!this.registerForm
        });
    }

    setupEventListeners() {
        // Toggle to register form
        if (this.registerBtn) {
            this.registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Switching to register form');
                this.container.classList.add('active');
                this.currentForm = 'register';
                this.animateFormSwitch('register');
            });
        }

        // Toggle to login form
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Switching to login form');
                this.container.classList.remove('active');
                this.currentForm = 'login';
                this.animateFormSwitch('login');
            });
        }

        // Form submissions
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Social authentication
        document.querySelectorAll('.google-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialAuth('google');
            });
        });

        document.querySelectorAll('.github-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialAuth('github');
            });
        });

        document.querySelectorAll('.facebook-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSocialAuth('facebook');
            });
        });

        // Forgot password
        const forgotPasswordLink = document.getElementById('forgotPassword');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        // Input focus animations
        document.querySelectorAll('.input-box input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    animateFormSwitch(toForm) {
        console.log(`Animating transition to: ${toForm}`);
        if (typeof gsap !== 'undefined') {
            const activeForm = document.querySelector('.form-box:not([style*="display: none"])');
            if (activeForm) {
                gsap.from(activeForm, {
                    opacity: 0,
                    x: toForm === 'register' ? -50 : 50,
                    duration: 0.6,
                    ease: "power2.out"
                });
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('.btn');

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        this.setButtonLoading(submitBtn, true);
        
        try {
            await this.simulateAuth({ email, password });
            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome back to AlgoRhythm!');
            
            setTimeout(() => {
                window.location.href = 'mainpage.html';
            }, 2000);
        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showNotification(error.message, 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = e.target.querySelector('.btn');

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        this.setButtonLoading(submitBtn, true);
        
        try {
            await this.simulateAuth({ name, email, password });
            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome to AlgoRhythm!');
            
            setTimeout(() => {
                window.location.href = 'mainpage.html';
            }, 2000);
        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showNotification(error.message, 'error');
        }
    }

    async handleSocialAuth(provider) {
        try {
            this.showNotification(`Connecting to ${provider}...`, 'info');
            await this.simulateSocialAuth(provider);
            this.showSuccessModal(`Successfully connected with ${provider}!`);
            
            setTimeout(() => {
                window.location.href = 'mainpage.html';
            }, 2000);
        } catch (error) {
            this.showNotification(`Failed to connect with ${provider}`, 'error');
        }
    }

    handleForgotPassword() {
        const email = document.getElementById('loginEmail').value;
        if (!email) {
            this.showNotification('Please enter your email address first', 'error');
            document.getElementById('loginEmail').focus();
            return;
        }
        this.showNotification('Password reset link sent to your email!', 'success');
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    setButtonSuccess(button) {
        button.classList.remove('loading');
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }

    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        const messageEl = document.getElementById('successMessage');
        if (messageEl) messageEl.textContent = message;
        if (modal) modal.classList.add('show');
    }

    showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // 3D Background, Matrix Effect, Cursor Follower methods
    // (Copy the setup3DBackground, setupMatrixEffect, setupCursorFollower, setupFloatingCodeAnimation methods from your original script-3.js)

    async simulateAuth(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data.email === 'test@error.com') {
                    reject(new Error('Invalid credentials'));
                } else {
                    resolve({ success: true, data });
                }
            }, 1500);
        });
    }

    async simulateSocialAuth(provider) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ success: true, provider });
                } else {
                    reject(new Error(`Failed to authenticate with ${provider}`));
                }
            }, 1000);
        });
    }
}

// Global function
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('show');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AuthManager...');
    new AuthManager();
    
    // Entrance animations
    if (typeof gsap !== 'undefined') {
        gsap.from('.container', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.3
        });
        
        gsap.from('.auth-header', {
            y: -100,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        
        gsap.from('.music-visualizer', {
            x: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.5
        });
    }
});
