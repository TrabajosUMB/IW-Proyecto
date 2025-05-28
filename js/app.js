// Productos disponibles (simulando una base de datos)
const products = {
    cerveza: [
        { id: 1, name: 'Poker', price: 2500, image: 'img/productos/poker.png', stock: 50, description: 'Cerveza colombiana tradicional 330ml' },
        { id: 2, name: 'Aguila', price: 2800, image: 'img/productos/aguila.png', stock: 45, description: 'Cerveza ligera y refrescante 330ml' },
        { id: 3, name: 'Corona', price: 4500, image: 'img/productos/corona.png', stock: 30, description: 'Cerveza mexicana premium 355ml' },
        { id: 4, name: 'Club Colombia', price: 3000, image: 'img/productos/club-colombia.png', stock: 40, description: 'Cerveza premium colombiana 330ml' }
    ],
    vino: [
        { id: 5, name: 'Vino Tinto Gato Negro', price: 35000, image: 'img/productos/gato-negro.png', stock: 20, description: 'Vino tinto chileno, Cabernet Sauvignon' },
        { id: 6, name: 'Casillero del Diablo', price: 45000, image: 'img/productos/casillero.png', stock: 15, description: 'Vino tinto chileno, Merlot' },
        { id: 7, name: 'Santa Rita', price: 38000, image: 'img/productos/santa-rita.png', stock: 25, description: 'Vino tinto chileno, Carmenere' }
    ],
    whisky: [
        { id: 8, name: 'Old Parr', price: 120000, image: 'img/productos/old-parr.png', stock: 10, description: 'Whisky escocés 12 años' },
        { id: 9, name: 'Buchanan\'s', price: 130000, image: 'img/productos/buchanans.png', stock: 12, description: 'Whisky escocés Deluxe' }
    ],
    aguardiente: [
        { id: 10, name: 'Nectar Verde', price: 45000, image: 'img/productos/nectar.png', stock: 30, description: 'Aguardiente sin azúcar 750ml' },
        { id: 11, name: 'Antioqueño', price: 42000, image: 'img/productos/antioqueno.png', stock: 35, description: 'Aguardiente tradicional 750ml' }
    ],
    licores: [
        { id: 12, name: 'Baileys', price: 75000, image: 'img/productos/baileys.png', stock: 18, description: 'Licor de crema irlandesa' },
        { id: 13, name: 'Jagermeister', price: 85000, image: 'img/productos/jager.png', stock: 20, description: 'Licor de hierbas alemán' }
    ]
};

/**
 * Archivo: app.js
 * Descripción: Funcionalidad principal de la aplicación Sip&Go
 * 
 * Contiene:
 * - Clase ShoppingCart: Manejo del carrito de compras
 * - Clase Auth: Manejo de autenticación de usuarios
 * - Funciones de carga y filtrado de productos
 * - Funciones para notificaciones y mensajes
 * - Manejo de eventos y actualización de UI
 * 
 */

// Clase para manejar el carrito de compras
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.updateTotal();
        this.initializeCartUI();
    }

    addItem(productId, category) {
        const product = products[category].find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
                this.showNotification('Producto añadido al carrito', 'success');
            } else {
                this.showNotification('Stock no disponible', 'error');
                return;
            }
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                category
            });
            this.showNotification('Producto añadido al carrito', 'success');
        }
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Producto eliminado del carrito', 'info');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return;

        const product = products[item.category].find(p => p.id === productId);
        if (!product) return;

        const newQuantity = parseInt(quantity);
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        if (newQuantity > product.stock) {
            this.showNotification(`Solo hay ${product.stock} unidades disponibles`, 'error');
            item.quantity = product.stock;
        } else {
            item.quantity = newQuantity;
            this.showNotification('Cantidad actualizada', 'success');
        }

        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    initializeCartUI() {
        // Crear el contador del carrito si no existe
        if (window.location.pathname.includes('categorias.html')) {
            const cartButton = document.querySelector('.btn-success[href="carrito.html"]');
            if (cartButton) {
                const badge = document.createElement('span');
                badge.id = 'cart-count';
                badge.className = 'badge bg-danger ms-1';
                cartButton.appendChild(badge);
            }
        }
        this.updateCartUI();
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('cart-items');

        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        if (cartTotal) {
            cartTotal.textContent = `$${this.total.toLocaleString()}`;
        }

        if (cartItems) {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item shadow-sm p-3 mb-3 bg-white rounded">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3" style="width: 80px; height: 80px; object-fit: contain;">
                        <div class="cart-item-details flex-grow-1">
                            <h5 class="mb-1">${item.name}</h5>
                            <p class="mb-1">Precio: $${item.price.toLocaleString()}</p>
                            <div class="d-flex align-items-center">
                                <div class="input-group" style="width: 120px;">
                                    <button class="btn btn-outline-secondary" type="button" 
                                            onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                    <input type="number" class="form-control text-center" value="${item.quantity}" 
                                           min="1" onchange="cart.updateQuantity(${item.id}, this.value)">
                                    <button class="btn btn-outline-secondary" type="button"
                                            onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                </div>
                                <button onclick="cart.removeItem(${item.id})" 
                                        class="btn btn-danger ms-3">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="cart-item-total ms-3">
                            <h5>$${(item.price * item.quantity).toLocaleString()}</h5>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Clase para manejar la autenticación
class Auth {
    constructor() {
        this.isLoggedIn = !!localStorage.getItem('user');
        this.updateAuthUI();
    }

    login(email, password) {
        // Simular autenticación
        if (email && password) {
            localStorage.setItem('user', JSON.stringify({ email }));
            this.isLoggedIn = true;
            this.updateAuthUI();

            // Verificar si hay una URL de redirección guardada
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
                localStorage.removeItem('redirectAfterLogin'); // Limpiar la URL guardada
                window.location.href = redirectUrl; // Redirigir al usuario
            } else {
                window.location.href = 'index.html'; // Redirigir a la página principal por defecto
            }

            return true;
        }
        return false;
    }

    logout() {
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.updateAuthUI();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const loginForm = document.getElementById('login-form');

        if (this.isLoggedIn) {
            const user = this.getCurrentUser();
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.innerHTML = `
                    <span>Bienvenido, ${user.name}</span>
                    <button onclick="auth.logout()">Cerrar sesión</button>
                `;
            }
            if (loginForm) loginForm.style.display = 'none';
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
        }
    }
}

// Inicializar carrito y autenticación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
    window.auth = new Auth();

    // Inicializar la página según la ruta actual
    if (window.location.pathname.includes('categorias.html')) {
        loadProducts('cerveza');
        handleCategorySelection();
    }
});

// Función para cargar los productos de una categoría
function loadProducts(category = 'cerveza') {
    const productsContainer = document.getElementById('products-container');
    const currentCategory = document.getElementById('current-category');
    if (!productsContainer) return;

    // Actualizar breadcrumb
    if (currentCategory) {
        currentCategory.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Agregar clase de carga
    productsContainer.classList.add('loading');

    // Limpiar contenedor
    productsContainer.innerHTML = '';

    // Obtener productos de la categoría
    const categoryProducts = products[category] || [];

    // Simular un pequeño retraso para mostrar la animación de carga
    setTimeout(() => {
                if (categoryProducts.length === 0) {
                    productsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <h3 class="text-muted">No hay productos disponibles en esta categoría</h3>
                </div>
            `;
                } else {
                    // Crear tarjetas de productos
                    categoryProducts.forEach(product => {
                                const productCard = document.createElement('div');
                                productCard.className = 'col';
                                productCard.innerHTML = `
                    <div class="card h-100 product-card">
                        ${product.discount ? `
                            <div class="position-absolute top-0 end-0 p-2">
                                <span class="badge bg-danger">-${product.discount}%</span>
                            </div>
                        ` : ''}
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-0">${product.name}</h5>
                                <div class="text-warning">
                                    ${Array(5).fill().map((_, i) => `
                                        <i class="fa${i < (product.rating || 4) ? 's' : 'r'} fa-star"></i>
                                    `).join('')}
                                </div>
                            </div>
                            <p class="card-text description">${product.description}</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        ${product.discount ? `
                                            <small class="text-muted text-decoration-line-through">$${product.price.toLocaleString()}</small><br>
                                            <strong class="text-success">$${Math.round(product.price * (1 - product.discount/100)).toLocaleString()}</strong>
                                        ` : `
                                            <strong class="text-success">$${product.price.toLocaleString()}</strong>
                                        `}
                                    </div>
                                    <span class="badge ${product.stock < 10 ? 'bg-warning' : 'bg-secondary'}">
                                        Stock: ${product.stock}
                                    </span>
                                </div>
                                <button class="btn btn-success w-100 add-to-cart-btn" onclick="cart.addItem(${product.id}, '${category}')">
                                    <i class="fas fa-cart-plus me-2"></i>Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                productsContainer.appendChild(productCard);
            });
        }

        // Quitar clase de carga
        productsContainer.classList.remove('loading');
    }, 300);
}

// Función para manejar la selección de categorías
function handleCategorySelection() {
    const categoryButtons = document.querySelectorAll('[data-category]');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Actualizar estado activo de los botones
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Cargar productos de la categoría seleccionada
            loadProducts(button.dataset.category);
        });
    });
}

// Función para mostrar los productos en el carrito
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !cartTotal) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item shadow-sm p-3 mb-3 bg-white rounded">
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}" class="me-3" style="width: 80px; height: 80px; object-fit: contain;">
                <div class="flex-grow-1">
                    <h5 class="mb-1">${item.name}</h5>
                    <p class="mb-1">Precio: $${item.price.toLocaleString()}</p>
                    <div class="d-flex align-items-center">
                        <div class="input-group" style="width: 120px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" class="form-control text-center" value="${item.quantity}" min="1" onchange="cart.updateQuantity(${item.id}, this.value)">
                            <button class="btn btn-outline-secondary" type="button" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="btn btn-danger ms-3" onclick="cart.removeItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="ms-3">
                    <h5>$${(item.price * item.quantity).toLocaleString()}</h5>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Total: $${total.toLocaleString()}`;
}

// Función para proceder al pago
function procederPago() {
    if (!auth.isLoggedIn) {
        // Guardar la URL actual para redirigir después del login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        
        // Mostrar notificación
        const notification = document.createElement('div');
        notification.className = 'notification info';
        notification.textContent = 'Por favor, inicia sesión para continuar con la compra';
        document.body.appendChild(notification);
        
        // Remover notificación después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        // Redirigir al login
        window.location.href = 'login.html';
        return;
    }

    // Si el usuario está autenticado, continuar con el proceso de pago
    // Aquí iría la lógica del proceso de pago
    alert('Procesando pago...');
}

// Agregar estilos para las notificaciones toast
const style = document.createElement('style');
style.textContent = `
    .toast-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #33691e;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out, fadeOut 0.3s ease-out 1.7s;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);