// app.js - чистый и простой код для Mini App
class ParfumDepoApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.products = [];
        this.cart = this.loadCart();
        this.currentSort = 'default';
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        this.tg.expand();
        this.tg.ready();
        
        this.bindEvents();
        this.loadProducts();
        this.updateCartUI();
    }

    bindEvents() {
        // Навигация
        document.getElementById('cartBtn').addEventListener('click', () => this.showPage('cartPage'));
        document.getElementById('mainBtn').addEventListener('click', () => this.showPage('mainPage'));
        
        // Поиск
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.renderProducts();
        });
        
        // Фильтр
        document.getElementById('filterButton').addEventListener('click', () => {
            this.toggleSort();
        });
        
        // Оформление заказа
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.createOrder();
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        
        // Обновляем активную кнопку навигации
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (pageId === 'mainPage') {
            document.getElementById('mainBtn').classList.add('active');
        } else if (pageId === 'cartPage') {
            document.getElementById('cartBtn').classList.add('active');
            this.updateCartUI();
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('products.json');
            const data = await response.json();
            this.products = data.products;
            this.renderProducts();
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            // Используем демо-данные если файл не загрузился
            this.products = this.getDemoProducts();
            this.renderProducts();
        }
    }

    getDemoProducts() {
        return [
            {
                id: 1,
                name: "Chanel Coco Mademoiselle Eau de Parfum 100ml",
                brand: "Chanel",
                category: "Женский",
                final_price: 14200,
                volume_ml: 100,
                concentration: "Eau de Parfum",
                description: "Цветочно-восточный аромат для современных женщин",
                notes: "бергамот, мандарин, жасмин, роза, пачули, ветивер",
                image: "",
                in_stock: true,
                is_tester: false
            },
            {
                id: 2,
                name: "Dior Sauvage Eau de Toilette Tester 120ml",
                brand: "Dior",
                category: "Мужской",
                final_price: 12800,
                volume_ml: 120,
                concentration: "Eau de Toilette",
                description: "Свежий пряный аромат для уверенных мужчин",
                notes: "перец, бергамот, амброксан, пачули, кедр",
                image: "",
                in_stock: true,
                is_tester: true
            },
            {
                id: 3,
                name: "Creed Aventus Eau de Parfum 100ml",
                brand: "Creed",
                category: "Мужской",
                final_price: 25600,
                volume_ml: 100,
                concentration: "Eau de Parfum",
                description: "Легендарный аромат для успешных людей",
                notes: "ананас, береза, яблоко, черная смородина, мускус",
                image: "",
                in_stock: true,
                is_tester: false
            }
        ];
    }

    renderProducts() {
        const catalog = document.getElementById('catalog');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const emptyState = document.getElementById('emptyState');
        
        loadingIndicator.classList.add('hidden');
        
        let filteredProducts = this.products;
        
        // Поиск
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.brand.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }
        
        // Сортировка
        if (this.currentSort === 'price_asc') {
            filteredProducts.sort((a, b) => a.final_price - b.final_price);
        } else if (this.currentSort === 'price_desc') {
            filteredProducts.sort((a, b) => b.final_price - a.final_price);
        }
        
        if (filteredProducts.length === 0) {
            catalog.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        catalog.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-header">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-brand">${product.brand} • ${product.category}</div>
                        <div class="product-meta">
                            ${product.volume_ml}ml • ${product.concentration}
                            ${product.is_tester ? '<span class="tester-badge">TESTER</span>' : ''}
                        </div>
                    </div>
                    <div class="product-price">${product.final_price} ₽</div>
                </div>
                
                <div class="product-description">${product.description}</div>
                <div class="product-notes">Ноты: ${product.notes}</div>
                
                <button 
                    class="add-to-cart-btn"
                    onclick="app.addToCart(${product.id})"
                >
                    🛒 Добавить в корзину
                </button>
            </div>
        `).join('');
    }

    toggleSort() {
        const filterBtn = document.getElementById('filterButton');
        
        switch (this.currentSort) {
            case 'default':
                this.currentSort = 'price_asc';
                filterBtn.textContent = 'Цена: по возрастанию';
                break;
            case 'price_asc':
                this.currentSort = 'price_desc';
                filterBtn.textContent = 'Цена: по убыванию';
                break;
            default:
                this.currentSort = 'default';
                filterBtn.textContent = 'Сортировка по цене';
                break;
        }
        
        this.renderProducts();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.final_price,
                volume_ml: product.volume_ml,
                concentration: product.concentration,
                is_tester: product.is_tester,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Товар добавлен в корзину!');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');
        const totalAmount = document.getElementById('totalAmount');
        const cartBadge = document.getElementById('cartBadge');
        
        // Бейдж корзины
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '';
            emptyCart.classList.remove('hidden');
            cartSummary.classList.add('hidden');
            return;
        }
        
        emptyCart.classList.add('hidden');
        cartSummary.classList.remove('hidden');
        
        let total = 0;
        
        cartItems.innerHTML = this.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} ₽</div>
                    </div>
                    
                    <div class="product-meta">
                        ${item.brand} • ${item.volume_ml}ml • ${item.concentration}
                        ${item.is_tester ? '<span class="tester-badge">TESTER</span>' : ''}
                    </div>
                    
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="app.removeFromCart(${item.id})">Удалить</button>
                    </div>
                    
                    <div style="text-align: right; margin-top: 8px; font-weight: bold;">
                        Итого: ${itemTotal} ₽
                    </div>
                </div>
            `;
        }).join('');
        
        totalAmount.textContent = total;
    }

    createOrder() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста!');
            return;
        }
        
        const orderData = {
            action: "create_order",
            products: this.cart,
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            timestamp: new Date().toISOString()
        };
        
        // Отправляем данные в бота
        this.tg.sendData(JSON.stringify(orderData));
        
        this.showNotification('✅ Заказ оформлен! Менеджер свяжется с вами.');
        
        // Очищаем корзину
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.showPage('mainPage');
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('parfumdepo_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('parfumdepo_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    showNotification(message) {
        alert(message);
    }
}

// Глобальные функции
function showPage(pageId) {
    app.showPage(pageId);
}

// Инициализация при загрузке страницы
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ParfumDepoApp();
});