// Portal Dashboard
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        window.location.href = 'distributor-portal.html';
        return;
    }
    
    // Display user name
    document.getElementById('distributorName').textContent = user.email.split('@')[0];
    
    // Load products
    loadProducts();
    
    // Load stats (mock data for now)
    document.getElementById('totalOrders').textContent = '12';
    document.getElementById('pendingOrders').textContent = '3';
    document.getElementById('completedOrders').textContent = '9';
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', async function() {
        await supabase.auth.signOut();
        window.location.href = 'distributor-portal.html';
    });
});

async function loadProducts() {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        document.getElementById('totalProducts').textContent = products.length;
        
        const productsGrid = document.getElementById('productsGrid');
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<p>No products available</p>';
            return;
        }
        
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card-small">
                <h4>${product.name}</h4>
                <p class="product-price">$${product.price}/bag</p>
                <button class="btn-small">Order Now</button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = '<p>Error loading products</p>';
    }
}
