// Portal Authentication
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        loginMessage.textContent = 'Signing in...';
        loginMessage.className = 'portal-message info';
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            loginMessage.textContent = 'Login successful! Redirecting...';
            loginMessage.className = 'portal-message success';
            
            setTimeout(() => {
                window.location.href = 'distributor-dashboard.html';
            }, 1000);
            
        } catch (error) {
            loginMessage.textContent = 'Invalid credentials. Please try again.';
            loginMessage.className = 'portal-message error';
        }
    });
});
