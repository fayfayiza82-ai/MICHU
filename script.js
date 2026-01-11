// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initMobileMenu();
    initScrollAnimations();
    initFormHandler();
    loadProducts();
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Initial call
    handleNavbarScroll();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            if (navMenu.style.display === 'flex') {
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.backgroundColor = 'var(--color-white)';
                navMenu.style.padding = 'var(--space-md)';
                navMenu.style.gap = 'var(--space-md)';
                navMenu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.style.display = 'none';
            }
        });
    }
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(249, 247, 243, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
    } else {
        navbar.style.backgroundColor = 'rgba(249, 247, 243, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
}

// Form Handler
function initFormHandler() {
    const form = document.getElementById('inquiryForm');
    if (!form) return;
    
    // Add CSRF token to form
    if (window.csrfProtection) {
        window.csrfProtection.addToForm(form);
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        
        // Check if submit button exists
        if (!submitBtn) return;
        
        // Disable button and show loading
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Get form data with null checks
        const inquiryType = document.getElementById('inquiryType');
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const companyField = document.getElementById('company');
        const countryField = document.getElementById('country');
        const messageField = document.getElementById('message');
        const csrfToken = form.querySelector('input[name="csrf_token"]');
        
        if (!inquiryType || !nameField || !emailField || !messageField) {
            showFormMessage('Form elements not found. Please refresh the page.', 'error');
            return;
        }
        
        // Validate CSRF token
        if (window.csrfProtection && (!csrfToken || !window.csrfProtection.validateToken(csrfToken.value))) {
            showFormMessage('Security validation failed. Please refresh the page.', 'error');
            return;
        }
        
        const formData = {
            type: inquiryType.value,
            name: nameField.value,
            email: emailField.value,
            company: companyField ? companyField.value : '',
            country: countryField ? countryField.value : '',
            message: messageField.value,
            created_at: new Date().toISOString(),
            status: 'pending'
        };
        
        try {
            // Check if Supabase client is available
            if (!window.supabaseClient) {
                throw new Error('Database connection not available');
            }
            
            // Save to Supabase
            const { error } = await window.supabaseClient
                .from('inquiries')
                .insert([formData]);
            
            if (error) throw error;
            
            // Send email notification
            if (window.emailService) {
                await window.emailService.sendInquiryNotification(formData);
            }
            
            // Show success message
            showFormMessage('Thank you for your inquiry. We will contact you within 24 hours.', 'success');
            
            // Reset form
            form.reset();
            
            // Re-add CSRF token after reset
            if (window.csrfProtection) {
                window.csrfProtection.addToForm(form);
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            showFormMessage('There was an error submitting your inquiry. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (!messageDiv) return;
    
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';
    }, 5000);
}

// Load Products from Supabase
async function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    try {
        // Check if Supabase client is available
        if (!window.supabaseClient) {
            throw new Error('Database connection not available');
        }
        
        // Fetch products from Supabase
        const { data: products, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('active', true)
            .order('order_index');
        
        if (error) throw error;
        
        // Clear loading message
        container.innerHTML = '';
        
        // Add products to DOM
        if (products && products.length > 0) {
            products.forEach(product => {
                const productCard = createProductCard(product);
                container.appendChild(productCard);
            });
            
            // Initialize animations for newly added cards
            initProductAnimations();
        } else {
            container.innerHTML = '<div class="no-products">No products available at the moment.</div>';
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = '<div class="error">Unable to load products. Please try again later.</div>';
    }
}

// Sanitize HTML content to prevent XSS
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    
    // Sanitize all product data before inserting
    const safeProduct = {
        name: sanitizeHTML(product.name || ''),
        type: sanitizeHTML(product.type || ''),
        description: sanitizeHTML(product.description || ''),
        weight: sanitizeHTML(product.weight || ''),
        certification: sanitizeHTML(product.certification || ''),
        packaging: sanitizeHTML(product.packaging || ''),
        color: product.color || 'var(--color-beige)'
    };
    
    card.innerHTML = `
        <div class="product-image" style="background-color: ${safeProduct.color}">
            <div class="product-overlay"></div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${safeProduct.name}</h3>
            <div class="product-type">${safeProduct.type}</div>
            <p class="product-description">${safeProduct.description}</p>
            <div class="product-specs">
                <div class="product-spec">
                    <i class="fas fa-weight-hanging"></i>
                    <span>${safeProduct.weight}</span>
                </div>
                <div class="product-spec">
                    <i class="fas fa-certificate"></i>
                    <span>${safeProduct.certification}</span>
                </div>
                <div class="product-spec">
                    <i class="fas fa-box"></i>
                    <span>${safeProduct.packaging}</span>
                </div>
            </div>
        </div>
    `;
    
    // Add click event
    card.addEventListener('click', () => {
        console.log('Selected product:', safeProduct.name);
    });
    
    return card;
}

function initProductAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.product-card.fade-in').forEach(card => {
        observer.observe(card);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && window.innerWidth <= 768) {
                navMenu.style.display = 'none';
            }
        }
    });
});