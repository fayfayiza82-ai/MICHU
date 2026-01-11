// supabase.js
// Initialize Supabase client
const supabaseUrl = 'https://isyeqswbigdxrwlooimk.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzeWVxc3diaWdkeHJ3bG9vaW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MjM2NTQsImV4cCI6MjA4MzQ5OTY1NH0.YOA3R2Vahip7D8gYFYgNUFwfjhxScxQyX_IHb5FV_Co'; // Replace with your Supabase anon key

// Initialize the client
window.supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Test connection on load
async function testConnection() {
    try {
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('count')
            .limit(1);
        
        if (error) throw error;
        
        console.log('Supabase connected successfully');
    } catch (error) {
        console.error('Supabase connection error:', error);
        showConnectionError();
    }
}

function showConnectionError() {
    // Prevent multiple error notifications
    const existingError = document.querySelector('.connection-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'connection-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ffebee;
        color: #c62828;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 10000;
        font-family: var(--font-sans);
        font-size: 14px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    errorDiv.innerHTML = `
        <strong>Connection Issue</strong><br>
        Unable to connect to database. Some features may be unavailable.
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', testConnection);

// Product management functions (for admin panel)
window.productManagement = {
    // Get all products
    async getAllProducts() {
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .order('order_index');
        
        if (error) throw error;
        return data;
    },
    
    // Add new product
    async addProduct(productData) {
        const { data, error } = await window.supabaseClient
            .from('products')
            .insert([productData])
            .select();
        
        if (error) throw error;
        return data[0];
    },
    
    // Update product
    async updateProduct(id, updates) {
        const { data, error } = await window.supabaseClient
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        if (!data || data.length === 0) {
            throw new Error('Product not found or no changes made');
        }
        return data[0];
    },
    
    // Delete product
    async deleteProduct(id) {
        const { error } = await window.supabaseClient
            .from('products')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },
    
    // Get all inquiries
    async getAllInquiries() {
        const { data, error } = await window.supabaseClient
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },
    
    // Update inquiry status
    async updateInquiryStatus(id, status) {
        const { data, error } = await window.supabaseClient
            .from('inquiries')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }
};