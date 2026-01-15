// Portal Authentication
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');
    const toggleText = document.getElementById('toggleText');

    // Toggle between Sign In and Sign Up using event delegation
    if (toggleText) {
        toggleText.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'toggleForm') {
                e.preventDefault();
                const isLoginVisible = loginForm.style.display !== 'none';

                if (isLoginVisible) {
                    loginForm.style.display = 'none';
                    signupForm.style.display = 'block';
                    toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleForm">Sign In</a>';
                } else {
                    loginForm.style.display = 'block';
                    signupForm.style.display = 'none';
                    toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleForm">Sign Up</a>';
                }
            }
        });
    }

    // Sign In
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            loginMessage.textContent = 'Signing in...';
            loginMessage.className = 'portal-message info';
            
            try {
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) throw error;
                
                loginMessage.textContent = 'Login successful! Redirecting...';
                loginMessage.className = 'portal-message success';
                
                setTimeout(() => {
                    window.location.href = '../admin/distributor-dashboard.html';
                }, 1000);
                
            } catch (error) {
                loginMessage.textContent = 'Invalid credentials. Please try again.';
                loginMessage.className = 'portal-message error';
            }
        });
    }

    // Sign Up
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const company = document.getElementById('signupCompany').value;
            
            signupMessage.textContent = 'Creating account...';
            signupMessage.className = 'portal-message info';
            
            try {
                const { data, error } = await window.supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name,
                            company: company
                        }
                    }
                });
                
                if (error) throw error;
                
                signupMessage.textContent = 'Account created! Please check your email to verify.';
                signupMessage.className = 'portal-message success';
                
                setTimeout(() => {
                    signupForm.reset();
                    loginForm.style.display = 'block';
                    signupForm.style.display = 'none';
                    if (toggleText) {
                        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleForm">Sign Up</a>';
                    }
                }, 3000);
                
            } catch (error) {
                signupMessage.textContent = error.message || 'Error creating account. Please try again.';
                signupMessage.className = 'portal-message error';
            }
        });
    }
});
