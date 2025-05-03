// Clase para manejar el carrito de compras
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.updateTotal();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({...product, quantity: 1});
        }
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(name, quantity) {
        const item = this.items.find(item => item.name === name);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(name);
            }
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

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('cart-items');

        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        if (cartTotal) {
            cartTotal.textContent = `$${this.total.toFixed(2)}`;
        }

        if (cartItems) {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Precio: $${item.price}</p>
                        <input type="number" value="${item.quantity}" 
                               min="0" onchange="cart.updateQuantity('${item.name}', this.value)">
                        <button onclick="cart.removeItem('${item.name}')" class="remove-item">Eliminar</button>
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
        // Aquí deberías hacer una llamada a tu API de autenticación
        // Por ahora, simularemos una autenticación básica
        if (email && password) {
            const user = {
                email,
                name: email.split('@')[0]
            };
            localStorage.setItem('user', JSON.stringify(user));
            this.isLoggedIn = true;
            this.updateAuthUI();
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

// Inicializar carrito y autenticación
const cart = new ShoppingCart();
const auth = new Auth();

// Función para mostrar/ocultar el carrito
function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel) {
        cartPanel.classList.toggle('active');
    }
}

// Función para mostrar/ocultar el formulario de login
function toggleLogin() {
    const loginPanel = document.getElementById('login-panel');
    if (loginPanel) {
        loginPanel.classList.toggle('active');
    }
}

// Función para manejar el envío del formulario de login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (auth.login(email, password)) {
        toggleLogin();
    } else {
        alert('Credenciales inválidas');
    }
}

// Función para alternar la visibilidad de las categorías
function toggleCategoria(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.fa-chevron-down');
    
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        icon.style.transform = 'rotate(180deg)';
    }
}

// Función para agregar productos al carrito
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Buscar si el producto ya existe en el carrito
    const existingProductIndex = cart.findIndex(item => item.name === name);
    
    if (existingProductIndex > -1) {
        // Si el producto existe, incrementar la cantidad
        cart[existingProductIndex].quantity += 1;
    } else {
        // Si el producto no existe, agregarlo al carrito
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Guardar el carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Mostrar mensaje de confirmación
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = 'Producto agregado al carrito';
    document.body.appendChild(toast);
    
    // Remover el mensaje después de 2 segundos
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// Función para mostrar los productos en el carrito
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    if (!cartContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    
    cartContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Precio: $${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartContainer.appendChild(cartItem);
    });
    
    if (totalElement) {
        totalElement.textContent = `Total: $${total}`;
    }
}

// Función para actualizar la cantidad de un producto
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Inicializar la visualización del carrito si estamos en la página del carrito
if (window.location.pathname.includes('carrito.html')) {
    displayCart();
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
