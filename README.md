<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ParfumDEPO - Магазин парфюмерии</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app">
        <!-- Главная страница -->
        <div id="mainPage" class="page active">
            <header class="header">
                <h1 class="store-name">ParfumDEPO</h1>
                <p class="store-subtitle">Автоматические цены по курсу ЦБ РФ</p>
                
                <div class="search-container">
                    <input type="text" id="searchInput" placeholder="🔍 Поиск парфюма..." class="search-input">
                </div>
                
                <div class="filters">
                    <button id="filterButton" class="filter-btn">Сортировка по цене</button>
                </div>
            </header>

            <main class="catalog-container">
                <div id="loadingIndicator" class="loading">
                    <div class="spinner"></div>
                    Загрузка каталога...
                </div>
                
                <div id="catalog" class="catalog"></div>
                
                <div id="emptyState" class="empty-state hidden">
                    <div class="empty-icon">😔</div>
                    <h3>Товары не найдены</h3>
                    <p>Попробуйте изменить параметры поиска</p>
                </div>
            </main>

            <footer class="footer">
                <button id="cartBtn" class="nav-btn">
                    <span class="nav-icon">🛒</span>
                    <span class="nav-text">Корзина</span>
                    <span id="cartBadge" class="cart-badge hidden">0</span>
                </button>
                <button id="mainBtn" class="nav-btn active">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-text">Главная</span>
                </button>
            </footer>
        </div>

        <!-- Страница корзины -->
        <div id="cartPage" class="page">
            <header class="header">
                <button class="back-btn" onclick="app.showPage('mainPage')">
                    <span>←</span> Назад
                </button>
                <h2>🛒 Корзина</h2>
            </header>

            <main class="cart-container">
                <div id="cartItems" class="cart-items"></div>
                
                <div id="emptyCart" class="empty-state">
                    <div class="empty-icon">🛒</div>
                    <h3>Корзина пуста</h3>
                    <p>Добавьте товары из каталога</p>
                </div>
                
                <div id="cartSummary" class="cart-summary hidden">
                    <div class="total-row">
                        <span>Итого:</span>
                        <span id="totalAmount" class="total-amount">0 ₽</span>
                    </div>
                    <button id="checkoutBtn" class="checkout-btn">
                        📦 Перейти к оформлению
                    </button>
                </div>
            </main>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
