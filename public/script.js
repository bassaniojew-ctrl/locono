// Global variables
let currentUser = null;
let cart = [];
let products = [];

// DOM elements
const searchInput = document.getElementById('searchInput');
const heroSearch = document.getElementById('heroSearch');
const searchBtn = document.getElementById('searchBtn');
const heroSearchBtn = document.getElementById('heroSearchBtn');
const loginBtn = document.getElementById('loginBtn');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.querySelector('.cart-count');
const loginModal = document.getElementById('loginModal');
const cartModal = document.getElementById('cartModal');
const featuredProducts = document.getElementById('featuredProducts');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    setupEventListeners();
    checkAuthStatus();
});

// Event Listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    heroSearchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });
    heroSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    // Modal functionality
    loginBtn.addEventListener('click', () => openModal('loginModal'));
    cartBtn.addEventListener('click', () => openModal('cartModal'));
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });

    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });

    // Auth tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            searchByCategory(category);
        });
    });

    // Subscribe button
    document.getElementById('subscribeBtn').addEventListener('click', handleSubscribe);
}

// Search functionality
function handleSearch() {
    const query = searchInput.value || heroSearch.value;
    if (query.trim()) {
        searchProducts(query);
    }
}

async function searchProducts(query) {
    try {
        const response = await fetch(`/api/products/search/${encodeURIComponent(query)}`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Error searching products', 'error');
    }
}

function searchByCategory(category) {
    window.location.href = `products.html?category=${category}`;
}

// Product display
async function loadFeaturedProducts() {
    try {
        const response = await fetch('/api/products?featured=true&limit=8');
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

function displayProducts(products) {
    if (featuredProducts) {
        featuredProducts.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product._id}">
                <div class="product-image">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-vendor">${product.vendor?.businessName || 'Local Store'}</div>
                    <div class="product-price">₹${product.price}</div>
                    <button class="add-to-cart" onclick="addToCart('${product._id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Cart functionality
function addToCart(productId) {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }

    const product = products.find(p => p._id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            vendor: product.vendor?.businessName || 'Local Store',
            price: product.price,
            quantity: 1
        });
    }

    updateCartUI();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartUI();
    showNotification('Product removed from cart', 'info');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            updateCartUI();
        }
    }
}

function updateCartUI() {
    cartCount.textContent = cart.length;
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-shopping-basket"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-vendor">${item.vendor}</div>
                    <div class="quantity-controls">
                        <button onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-price">₹${item.price * item.quantity}</div>
                <button onclick="removeFromCart('${item.productId}')" class="remove-btn">×</button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
        password: formData.get('password') || e.target.querySelector('input[type="password"]').value
    };

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', result.token);
            currentUser = result.user;
            updateAuthUI();
            closeModal();
            showNotification('Login successful!', 'success');
        } else {
            showNotification(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name') || e.target.querySelector('input[placeholder="Full Name"]').value,
        email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
        phone: formData.get('phone') || e.target.querySelector('input[type="tel"]').value,
        password: formData.get('password') || e.target.querySelector('input[type="password"]').value,
        role: formData.get('role') || e.target.querySelector('select').value
    };

    try {
        const endpoint = data.role === 'vendor' ? '/api/auth/register/vendor' : '/api/auth/register/customer';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', result.token);
            currentUser = result.user || result.vendor;
            updateAuthUI();
            closeModal();
            showNotification('Registration successful!', 'success');
        } else {
            showNotification(result.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }
}

async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                currentUser = result.user;
                updateAuthUI();
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('token');
        }
    }
}

function updateAuthUI() {
    if (currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loginBtn.onclick = () => {
            if (confirm('Do you want to logout?')) {
                logout();
            }
        };
    } else {
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
        loginBtn.onclick = () => openModal('loginModal');
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateAuthUI();
    showNotification('Logged out successfully', 'info');
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update forms
    document.getElementById('loginForm').style.display = tabName === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = tabName === 'register' ? 'block' : 'none';
}

// Subscription
function handleSubscribe() {
    if (!currentUser) {
        openModal('loginModal');
        return;
    }
    
    showNotification('Subscription feature coming soon!', 'info');
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    .quantity-controls button {
        width: 30px;
        height: 30px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .quantity-controls button:hover {
        background: #f0f0f0;
    }
    .remove-btn {
        background: #f44336;
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 1rem;
    }
    .remove-btn:hover {
        background: #d32f2f;
    }
`;
document.head.appendChild(style);
