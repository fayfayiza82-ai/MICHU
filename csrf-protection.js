// CSRF Protection Module
class CSRFProtection {
    constructor() {
        this.token = this.generateToken();
        this.setupMetaTag();
    }
    
    generateToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    
    setupMetaTag() {
        let metaTag = document.querySelector('meta[name="csrf-token"]');
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'csrf-token';
            document.head.appendChild(metaTag);
        }
        metaTag.content = this.token;
    }
    
    getToken() {
        return this.token;
    }
    
    validateToken(submittedToken) {
        return submittedToken === this.token;
    }
    
    addToForm(form) {
        let tokenInput = form.querySelector('input[name="csrf_token"]');
        if (!tokenInput) {
            tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'csrf_token';
            form.appendChild(tokenInput);
        }
        tokenInput.value = this.token;
    }
}

// Initialize CSRF protection
window.csrfProtection = new CSRFProtection();