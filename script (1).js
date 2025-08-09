// Enhanced Authentication JavaScript with smooth transitions
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
        this.container = document.querySelector('.container');
        this.registerBtn = document.querySelector('.register-btn');
        this.loginBtn = document.querySelector('.login-btn');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.currentForm = 'login';
    }

    setupEventListeners() {
        // Toggle between login and register with smooth animation - MAIN FUNCTIONALITY
        this.registerBtn?.addEventListener('click', () => {
            this.container.classList.add('active');
            this.currentForm = 'register';
            this.animateFormSwitch('register');
            console.log('Switched to Register');
        });

        this.loginBtn?.addEventListener('click', () => {
            this.container.classList.remove('active');
            this.currentForm = 'login';
            this.animateFormSwitch('login');
            console.log('Switched to Login');
        });

        // Form submissions
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));

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

        // Password strength checking
        document.getElementById('registerPassword')?.addEventListener('input', (e) => {
            this.updatePasswordStrength(e.target.value);
        });

        // Password confirmation validation
        document.getElementById('confirmPassword')?.addEventListener('input', (e) => {
            this.validatePasswordConfirmation();
        });

        // Forgot password
        document.getElementById('forgotPassword')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Real-time email validation
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('blur', (e) => this.validateEmail(e.target));
        });

        // Input focus animations
        document.querySelectorAll('.input-box input').forEach(input => {
            input.addEventListener('focus', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.parentElement, {
                        scale: 1.02,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
            
            input.addEventListener('blur', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.parentElement, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    animateFormSwitch(toForm) {
        // Add subtle animation when switching forms
        const forms = document.querySelectorAll('.form-box');
        
        if (typeof gsap !== 'undefined') {
            forms.forEach(form => {
                gsap.from(form, {
                    opacity: 0,
                    x: toForm === 'register' ? 20 : -20,
                    duration: 0.5,
                    delay: 0.3,
                    ease: "power2.out"
                });
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('.btn');

        if (!this.validateEmail(document.getElementById('loginEmail'))) return;

        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.simulateAuth({ email, password });
            
            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome back to AlgoRhythm!', 'login');
            
            setTimeout(() => {
                this.redirectToApp();
            }, 2000);
            
        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showNotification(error.message, 'error');
            this.animateInputError(document.getElementById('loginEmail'));
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        const submitBtn = e.target.querySelector('.btn');

        // Validation
        if (!name.trim()) {
            this.showNotification('Please enter your full name', 'error');
            this.animateInputError(document.getElementById('registerName'));
            return;
        }

        if (!this.validateEmail(document.getElementById('registerEmail'))) return;
        if (!this.validatePassword(password)) return;
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            this.animateInputError(document.getElementById('confirmPassword'));
            return;
        }
        
        if (!acceptTerms) {
            this.showNotification('Please accept the terms and privacy policy', 'error');
            return;
        }

        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API call
            await this.simulateAuth({ name, email, password });
            
            this.setButtonSuccess(submitBtn);
            this.showSuccessModal('Welcome to AlgoRhythm!', 'register');
            
            setTimeout(() => {
                this.redirectToApp();
            }, 2000);
            
        } catch (error) {
            this.setButtonLoading(submitBtn, false);
            this.showNotification(error.message, 'error');
        }
    }

    async handleSocialAuth(provider) {
        try {
            this.showNotification(`Connecting to ${provider}...`, 'info');
            
            // Simulate social auth
            await this.simulateSocialAuth(provider);
            
            this.showSuccessModal(`Successfully connected with ${provider}!`, 'social');
            
            setTimeout(() => {
                this.redirectToApp();
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
            this.animateInputError(document.getElementById('loginEmail'));
            return;
        }

        if (!this.validateEmail(document.getElementById('loginEmail'))) return;

        // Animate forgot password link
        if (typeof gsap !== 'undefined') {
            gsap.to('#forgotPassword', {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }

        this.showNotification('Password reset link sent to your email!', 'success');
    }

    // Validation methods
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.animateInputError(input);
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        this.animateInputSuccess(input);
        return true;
    }

    validatePassword(password) {
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return false;
        }
        return true;
    }

    validatePasswordConfirmation() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmInput = document.getElementById('confirmPassword');
        
        if (confirmPassword && password !== confirmPassword) {
            this.animateInputError(confirmInput);
            confirmInput.style.borderColor = '#ef4444';
        } else if (confirmPassword) {
            this.animateInputSuccess(confirmInput);
            confirmInput.style.borderColor = '#10b981';
        }
    }

    updatePasswordStrength(password) {
        const strengthBars = document.querySelectorAll('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        let strength = 0;
        
        // Calculate strength
        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
        
        const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
        
        strengthBars.forEach((bar, index) => {
            if (index < strength) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(bar, {
                        backgroundColor: colors[Math.min(strength - 1, 4)],
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                bar.classList.add(strength <= 2 ? 'weak' : strength <= 3 ? 'medium' : 'strong');
            } else {
                if (typeof gsap !== 'undefined') {
                    gsap.to(bar, {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        scale: 0.8,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                bar.classList.remove('weak', 'medium', 'strong');
            }
        });
        
        if (strengthText && password.length > 0) {
            strengthText.textContent = levels[Math.min(strength, 4)] || 'Very Weak';
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(strengthText, 
                    { opacity: 0, y: 5 },
                    { opacity: 1, y: 0, duration: 0.3 }
                );
            }
        }
    }

    // UI Animation methods
    animateInputError(input) {
        if (typeof gsap !== 'undefined') {
            gsap.to(input, {
                x: [-5, 5, -5, 5, 0],
                duration: 0.5,
                ease: "power2.out"
            });
        }
        
        input.style.borderColor = '#ef4444';
    }

    animateInputSuccess(input) {
        input.style.borderColor = '#10b981';
        
        if (typeof gsap !== 'undefined') {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
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
        
        if (typeof gsap !== 'undefined') {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    }

    showSuccessModal(message, type) {
        const modal = document.getElementById('successModal');
        const messageEl = document.getElementById('successMessage');
        
        messageEl.textContent = message;
        modal.classList.add('show');
        
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(modal.querySelector('.modal-content'),
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        if (typeof gsap !== 'undefined') {
            gsap.to(notification, {
                className: `notification ${type} show`,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            notification.classList.add('show');
        }
        
        // Auto remove
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(notification, {
                    opacity: 0,
                    y: -50,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => notification.remove()
                });
            } else {
                notification.remove();
            }
        }, 4000);
    }

    // 3D Background setup
    setup3DBackground() {
        const canvas = document.getElementById('auth-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create floating geometric shapes
        const shapes = [];
        
        // Add cubes
        for (let i = 0; i < 30; i++) {
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xF59E0B, 
                wireframe: true,
                transparent: true,
                opacity: 0.4
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
            );
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            scene.add(cube);
            shapes.push(cube);
        }

        // Add spheres
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0xFBBF24,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(
                Math.random() * 15 - 7.5,
                Math.random() * 15 - 7.5,
                Math.random() * 15 - 7.5
            );
            
            scene.add(sphere);
            shapes.push(sphere);
        }

        // Central music visualization cube
        const musicGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const musicMaterial = new THREE.MeshBasicMaterial({
            color: 0xF59E0B,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const musicCube = new THREE.Mesh(musicGeometry, musicMaterial);
        scene.add(musicCube);

        camera.position.z = 12;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Animate floating shapes
            shapes.forEach((shape, index) => {
                shape.rotation.x += 0.005;
                shape.rotation.y += 0.005;
                shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.003;
            });

            // Animate music cube
            musicCube.rotation.x += 0.008;
            musicCube.rotation.y += 0.012;
            musicCube.scale.setScalar(1 + Math.sin(Date.now() * 0.004) * 0.1);

            // Mouse parallax
            camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Matrix rain effect
    setupMatrixEffect() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const codeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]<>/\\|`~+-=";
        const matrix = codeChars.split("");

        const font_size = 12;
        const columns = canvas.width / font_size;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#F59E0B';
            ctx.font = font_size + 'px "JetBrains Mono", monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * font_size, drops[i] * font_size);

                if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(draw, 50);

        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Cursor follower
    setupCursorFollower() {
        const follower = document.querySelector('.cursor-follower');
        if (!follower) return;

        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };

        animateFollower();

        // Add interaction effects
        document.querySelectorAll('button, a, input').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(follower, {
                        scale: 1.5,
                        opacity: 0.8,
                        duration: 0.3
                    });
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(follower, {
                        scale: 1,
                        opacity: 0.6,
                        duration: 0.3
                    });
                }
            });
        });
    }

    setupFloatingCodeAnimation() {
        // Additional floating animations for code snippets
        if (typeof gsap !== 'undefined') {
            gsap.to('.code-snippet', {
                y: -10,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.5
            });
        }
    }

    // Helper methods
    redirectToApp() {
        // Replace with your actual app URL
        window.location.href = '/dashboard'; // or wherever your main app is
    }

    // Simulation methods (replace with actual API calls)
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
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, provider });
                } else {
                    reject(new Error(`Failed to authenticate with ${provider}`));
                }
            }, 1000);
        });
    }
}

// Global functions
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
    
    // Add some entrance animations
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

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    const canvas3d = document.getElementById('auth-3d-canvas');
    const matrixCanvas = document.getElementById('matrix-canvas');
    
    if (document.hidden) {
        // Pause animations when tab is not visible
        if (canvas3d) canvas3d.style.display = 'none';
        if (matrixCanvas) matrixCanvas.style.display = 'none';
    } else {
        if (canvas3d) canvas3d.style.display = 'block';
        if (matrixCanvas) matrixCanvas.style.display = 'block';
    }
});
