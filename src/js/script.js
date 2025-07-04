// Clase principal para manejar el inventario con persistencia
class InventoryManager {
    constructor() {
        this.products = [];
        this.editingId = null;
        this.currentTheme = 'dark';
        this.notificationId = 0;
        this.storageKey = 'inventory_products';
        this.init();
    }

    init() {
        this.setThemeByTime(); // 🌗 Establecer tema según la hora antes de cargar datos
        this.loadFromStorage();
        this.setupEventListeners();
        this.createParticles();
        this.updateStats();
        this.renderProducts();
    }

    setThemeByTime() {
        const hora = new Date().getHours();
        const esDeDia = hora >= 6 && hora < 18;
    
        this.currentTheme = esDeDia ? 'dark' : 'light';
    
        document.body.setAttribute('data-theme', this.currentTheme);
    
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
        }
    }
    

    // ===== MÉTODOS DE PERSISTENCIA =====
    
    saveToStorage() {
        try {
            const dataToSave = {
                products: this.products,
                theme: this.currentTheme,
                lastUpdated: new Date().toISOString()
            };
            const storage = {};
            storage[this.storageKey] = JSON.stringify(dataToSave);
            // Simular localStorage usando variables globales
            window.inventoryData = storage;
            console.log('Datos guardados correctamente');
        } catch (error) {
            console.error('Error al guardar datos:', error);
            this.showNotification('Error al guardar los datos', 'error');
        }
    }

    loadFromStorage() {
        try {
            // Simular carga desde localStorage
            if (window.inventoryData && window.inventoryData[this.storageKey]) {
                const savedData = JSON.parse(window.inventoryData[this.storageKey]);
                this.products = savedData.products || [];
                this.currentTheme = savedData.theme || 'dark';
                console.log('Datos cargados correctamente:', this.products.length, 'productos');
            } else {
                // Si no hay datos guardados, cargar datos de ejemplo
                this.loadSampleData();
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.loadSampleData();
        }
    }

    clearAllData() {
        this.products = [];
        this.saveToStorage();
        this.renderProducts();
        this.updateStats();
        this.showNotification('Todos los datos han sido eliminados', 'success');
    }

    // ===== CONFIGURACIÓN INICIAL =====
    
    setupEventListeners() {
        // Formulario
        const form = document.getElementById('inventory-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Botón cancelar
        const cancelBtn = document.getElementById('cancel-btn');
        cancelBtn.addEventListener('click', () => this.cancelEdit());

        // Botón limpiar todo
        const clearAllBtn = document.getElementById('clear-all-btn');
        clearAllBtn.addEventListener('click', () => this.showClearAllConfirmation());

        // Búsqueda
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Filtros
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        categoryFilter.addEventListener('change', () => this.applyFilters());
        sortFilter.addEventListener('change', () => this.applyFilters());

        // Tema
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Modal
        const modalOverlay = document.getElementById('modal-overlay');
        const modalClose = document.getElementById('modal-close');
        const modalCancel = document.getElementById('modal-cancel');
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) this.hideModal();
        });
        modalClose.addEventListener('click', () => this.hideModal());
        modalCancel.addEventListener('click', () => this.hideModal());
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    loadSampleData() {
        this.products = [
            {
                id: 1,
                name: 'AirPods Pro',
                quantity: 5,
                price: 1299.99,
                category: 'electronics',
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: 2,
                name: 'Camiseta Deportiva',
                quantity: 25,
                price: 29.99,
                category: 'clothing',
                createdAt: new Date('2024-01-16').toISOString()
            },
            {
                id: 3,
                name: 'Libro de Programación',
                quantity: 15,
                price: 45.50,
                category: 'books',
                createdAt: new Date('2024-01-17').toISOString()
            }
        ];
        this.saveToStorage();
    }

    // ===== GESTIÓN DE PRODUCTOS =====
    
    handleFormSubmit(e) {
        e.preventDefault();
        this.setLoading(true);

        setTimeout(() => {
            const formData = new FormData(e.target);
            const productData = {
                name: formData.get('name').trim(),
                quantity: parseInt(formData.get('quantity')),
                price: parseFloat(formData.get('price')),
                category: formData.get('category')
            };

            if (this.editingId) {
                this.updateProduct(this.editingId, productData);
            } else {
                this.addProduct(productData);
            }

            this.setLoading(false);
            this.resetForm();
        }, 1000);
    }

    addProduct(productData) {
        if (!this.validateProduct(productData)) return;
    
        const nombreNormalizado = productData.name.trim().toLowerCase();
    
        const yaExiste = this.products.some(
            (p) => p.name.trim().toLowerCase() === nombreNormalizado
        );
    
        if (yaExiste) {
            this.showNotification('Este producto ya existe en el inventario', 'error');
            return;
        }
    
        const newProduct = {
            id: Date.now(),
            ...productData,
            createdAt: new Date().toISOString()
        };
    
        this.products.push(newProduct);
        this.saveToStorage();
        this.renderProducts();
        this.updateStats();
        this.showNotification('Producto agregado exitosamente', 'success');
    }
    

    updateProduct(id, productData) {
        if (!this.validateProduct(productData)) return;

        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...productData,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            this.renderProducts();
            this.updateStats();
            this.showNotification('Producto actualizado exitosamente', 'success');
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            const productName = this.products[index].name;
            this.products.splice(index, 1);
            this.saveToStorage();
            this.renderProducts();
            this.updateStats();
            this.showNotification(`"${productName}" eliminado exitosamente`, 'success');
        }
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        this.editingId = id;
        this.fillForm(product);
        this.updateSubmitButton('Actualizar Producto');
        document.getElementById('cancel-btn').style.display = 'block';
    }

    validateProduct(productData) {
        if (!productData.name || productData.name.length < 2) {
            this.showNotification('El nombre debe tener al menos 2 caracteres', 'error');
            return false;
        }
        if (productData.quantity < 1) {
            this.showNotification('La cantidad debe ser mayor a 0', 'error');
            return false;
        }
        if (productData.price < 0) {
            this.showNotification('El precio debe ser mayor o igual a 0', 'error');
            return false;
        }
        if (!productData.category) {
            this.showNotification('Debe seleccionar una categoría', 'error');
            return false;
        }
        return true;
    }

    // ===== INTERFAZ DE USUARIO =====
    
    renderProducts() {
        const container = document.getElementById('products-container');
        const emptyState = document.getElementById('empty-state');
        
        if (this.products.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        container.innerHTML = this.products.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
        const categoryEmojis = {
            electronics: '',
            clothing: '',
            books: '',
            home: '',
            sports: ''
        };

        const categoryNames = {
            electronics: 'Electrónicos',
            clothing: 'Ropa',
            books: 'Libros',
            home: 'Hogar',
            sports: 'Deportes'
        };

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-header">
                    <div>
                        <div class="product-name">${categoryEmojis[product.category]} ${product.name}</div>
                        <div class="product-category">${categoryNames[product.category]}</div>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-quantity">Stock: ${product.quantity}</div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-edit btn-small" onclick="inventory.editProduct(${product.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-delete btn-small" onclick="inventory.showDeleteConfirmation(${product.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    fillForm(product) {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
    }

    resetForm() {
        document.getElementById('inventory-form').reset();
        this.editingId = null;
        this.updateSubmitButton('Agregar Producto');
        document.getElementById('cancel-btn').style.display = 'none';
    }

    cancelEdit() {
        this.resetForm();
        this.showNotification('Edición cancelada', 'info');
    }

    updateSubmitButton(text) {
        document.getElementById('submit-btn').querySelector('.btn-text').textContent = text;
    }

    setLoading(isLoading) {
        const btn = document.getElementById('submit-btn');
        if (isLoading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    // ===== BÚSQUEDA Y FILTROS =====
    
    handleSearch(searchTerm) {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const isVisible = productName.includes(searchTerm.toLowerCase());
            card.style.display = isVisible ? 'block' : 'none';
        });
    }

    applyFilters() {
        const categoryFilter = document.getElementById('category-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;
        
        let filteredProducts = [...this.products];

        // Filtrar por categoría
        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
        }

        // Ordenar
        filteredProducts.sort((a, b) => {
            switch (sortFilter) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return a.price - b.price;
                case 'quantity':
                    return b.quantity - a.quantity;
                default:
                    return 0;
            }
        });

        // Renderizar productos filtrados
        const container = document.getElementById('products-container');
        container.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
    }

    // ===== ESTADÍSTICAS =====
    
    updateStats() {
        const totalItems = this.products.reduce((sum, p) => sum + p.quantity, 0);
        const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('total-value').textContent = totalValue.toFixed(2);
    }

    // ===== TEMA =====
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        document.getElementById('theme-toggle').textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        this.saveToStorage();
    }

    // ===== MODALES =====
    
    showModal(title, message, onConfirm) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('modal-overlay').classList.add('show');
        
        const confirmBtn = document.getElementById('modal-confirm');
        confirmBtn.onclick = () => {
            onConfirm();
            this.hideModal();
        };
    }

    hideModal() {
        document.getElementById('modal-overlay').classList.remove('show');
    }

    showDeleteConfirmation(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.showModal(
                'Confirmar eliminación',
                `¿Estás seguro de que quieres eliminar "${product.name}"?`,
                () => this.deleteProduct(id)
            );
        }
    }

    showClearAllConfirmation() {
        this.showModal(
            'Limpiar inventario',
            '¿Estás seguro de que quieres eliminar todos los productos? Esta acción no se puede deshacer.',
            () => this.clearAllData()
        );
    }

    // ===== NOTIFICACIONES =====
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.id = `notification-${this.notificationId++}`;
        
        document.getElementById('notifications').appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Ocultar y remover notificación
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Inicializar la aplicación
const inventory = new InventoryManager();