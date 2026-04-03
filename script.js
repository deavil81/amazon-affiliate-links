// Google Sheets Configuration
const SHEET_ID = "1Q9y-CGlebZysgX5Kl5hOAa0H8y8GTP22spqkLPE3GtA";
const sheets = ["electronic", "home appliances", "fashion", "fitness"];

// DOM Elements
const productContainer = document.getElementById("products");
const categoryContainer = document.getElementById("categories");

// Store all products
let allProducts = [];

// Store section states
let sectionStates = {
    topDeals: { shown: 4, expanded: false },
    bestSellers: { shown: 4, expanded: false },
    budgetDeals: { shown: 4, expanded: false }
};

// Load products from Google Sheets
async function loadProducts() {
    showLoading();
    
    for (const sheet of sheets) {
        const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheet}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            
            data.forEach(product => {
                product.category = sheet;
                allProducts.push(product);
            });
            
            createCategory(sheet);
        } catch (error) {
            console.error(`Error loading ${sheet}:`, error);
        }
    }
    
    renderSections();
    renderProducts(allProducts);
    setupSearch();
}

// Show loading indicator
function showLoading() {
    if (productContainer) {
        productContainer.innerHTML = '<div class="loading">Loading products... 🔄</div>';
    }
}

// Render all sections with View More
function renderSections() {
    // Get products for each section
    const topDeals = allProducts.slice(0, 8);
    const bestSellers = allProducts.slice(4, 12);
    const budgetDeals = allProducts.filter(p => Number(p.price) <= 999);
    
    renderCustomWithViewMore(topDeals, "topDeals", "🔥 Top Deals Today");
    renderCustomWithViewMore(bestSellers, "bestSellers", "⭐ Best Sellers");
    renderCustomWithViewMore(budgetDeals, "budgetDeals", "💰 Deals Under ₹999");
}

// Render a section with View More button
function renderCustomWithViewMore(products, containerID, sectionTitle) {
    const container = document.getElementById(containerID);
    if (!container) return;
    
    const itemsToShow = 4;
    const hasMore = products.length > itemsToShow;
    const visibleProducts = products.slice(0, itemsToShow);
    const hiddenProducts = products.slice(itemsToShow);
    
    // Clear container
    container.innerHTML = "";
    
    // Add section header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'section-header';
    headerDiv.innerHTML = `<h2>${sectionTitle}</h2>`;
    container.appendChild(headerDiv);
    
    // Create product grid
    const gridDiv = document.createElement('div');
    gridDiv.className = 'product-grid';
    
    // Add visible products
    visibleProducts.forEach(product => {
        gridDiv.appendChild(createProductElement(product));
    });
    
    // Add hidden products
    hiddenProducts.forEach(product => {
        const productEl = createProductElement(product);
        productEl.classList.add('hidden-product');
        gridDiv.appendChild(productEl);
    });
    
    container.appendChild(gridDiv);
    
    // Add View More button if needed
    if (hasMore) {
        const viewMoreDiv = document.createElement('div');
        viewMoreDiv.className = 'view-more-container';
        viewMoreDiv.innerHTML = `
            <button class="view-more-btn" onclick="toggleSection('${containerID}')">
                View More (${hiddenProducts.length} more) ↓
            </button>
        `;
        container.appendChild(viewMoreDiv);
        
        // Store products data
        window[`${containerID}_products`] = products;
        window[`${containerID}_hiddenCount`] = hiddenProducts.length;
    }
}

// Create individual product element
function createProductElement(product) {
    const div = document.createElement('div');
    div.className = 'product';
    
    const price = Number(product.price) || 0;
    const oldPrice = Number(product.oldPrice) || 0;
    const discount = oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
    
    div.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/200x200?text=No+Image'}" alt="${product.name || 'Product'}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x200?text=Image+Not+Found'">
        <h3>${(product.name || 'Product').substring(0, 60)}</h3>
        <p>${(product.description || '').substring(0, 100)}${(product.description || '').length > 100 ? '...' : ''}</p>
        <div class="price">
            ₹${price.toLocaleString('en-IN')}
            ${oldPrice > 0 ? `<span class="old-price">₹${oldPrice.toLocaleString('en-IN')}</span>` : ''}
            ${discount > 0 ? `<span class="discount">(${discount}% off)</span>` : ''}
        </div>
        <a href="${product.link || '#'}" class="buy" target="_blank" rel="sponsored nofollow">
            View Deal →
        </a>
    `;
    
    return div;
}

// Toggle View More/Less for sections
window.toggleSection = function(containerID) {
    const container = document.getElementById(containerID);
    if (!container) return;
    
    const hiddenProducts = container.querySelectorAll('.hidden-product');
    const button = container.querySelector('.view-more-btn');
    if (!button) return;
    
    const isExpanded = button.textContent.includes('Show Less');
    
    if (isExpanded) {
        // Collapse
        hiddenProducts.forEach(product => {
            product.classList.add('hidden-product');
        });
        const hiddenCount = window[`${containerID}_hiddenCount`] || hiddenProducts.length;
        button.textContent = `View More (${hiddenCount} more) ↓`;
    } else {
        // Expand
        hiddenProducts.forEach(product => {
            product.classList.remove('hidden-product');
        });
        button.textContent = 'Show Less ↑';
        
        // Smooth scroll
        setTimeout(() => {
            button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
};

// Create category button
function createCategory(category) {
    if (!categoryContainer) return;
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    categoryDiv.onclick = () => filterCategory(category);
    
    const emoji = {
        'electronic': '⚡',
        'home appliances': '🏠',
        'fashion': '👗',
        'fitness': '💪'
    }[category] || '📦';
    
    const displayName = {
        'electronic': 'Electronics',
        'home appliances': 'Home Appliances',
        'fashion': 'Fashion',
        'fitness': 'Fitness'
    }[category] || category;
    
    categoryDiv.innerHTML = `${emoji} ${displayName}`;
    categoryContainer.appendChild(categoryDiv);
}

// Filter by category
window.filterCategory = function(category) {
    const filtered = allProducts.filter(p => p.category === category);
    renderProducts(filtered);
    
    // Scroll to products
    if (productContainer) {
        productContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Highlight active
    document.querySelectorAll('.category').forEach(cat => {
        cat.style.opacity = '0.6';
    });
    if (event && event.target) {
        event.target.style.opacity = '1';
    }
};

// Filter from deal cards
window.filterCategoryFromCard = function(category) {
    const filtered = allProducts.filter(p => p.category === category);
    renderProducts(filtered);
    
    if (productContainer) {
        productContainer.scrollIntoView({ behavior: 'smooth' });
    }
};

// Render trending products with View More
function renderProducts(products) {
    if (!productContainer) return;
    
    productContainer.innerHTML = "";
    
    // Add header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'section-header';
    headerDiv.innerHTML = `<h2>🔥 Trending Products</h2>`;
    productContainer.appendChild(headerDiv);
    
    const itemsToShow = 6;
    const hasMore = products.length > itemsToShow;
    const visibleProducts = products.slice(0, itemsToShow);
    const hiddenProducts = products.slice(itemsToShow);
    
    // Create grid
    const gridDiv = document.createElement('div');
    gridDiv.className = 'product-grid';
    
    visibleProducts.forEach(product => {
        gridDiv.appendChild(createProductElement(product));
    });
    
    hiddenProducts.forEach(product => {
        const productEl = createProductElement(product);
        productEl.classList.add('hidden-product');
        gridDiv.appendChild(productEl);
    });
    
    productContainer.appendChild(gridDiv);
    
    // Add View More button
    if (hasMore) {
        const viewMoreDiv = document.createElement('div');
        viewMoreDiv.className = 'view-more-container';
        viewMoreDiv.innerHTML = `
            <button class="view-more-btn" onclick="toggleTrendingSection()">
                View More (${hiddenProducts.length} more) ↓
            </button>
        `;
        productContainer.appendChild(viewMoreDiv);
        
        window.trendingProducts = products;
        window.trendingHiddenCount = hiddenProducts.length;
    }
}

// Toggle trending section
window.toggleTrendingSection = function() {
    if (!productContainer) return;
    
    const hiddenProducts = productContainer.querySelectorAll('.hidden-product');
    const button = productContainer.querySelector('.view-more-btn');
    if (!button) return;
    
    const isExpanded = button.textContent.includes('Show Less');
    
    if (isExpanded) {
        hiddenProducts.forEach(p => p.classList.add('hidden-product'));
        button.textContent = `View More (${window.trendingHiddenCount} more) ↓`;
    } else {
        hiddenProducts.forEach(p => p.classList.remove('hidden-product'));
        button.textContent = 'Show Less ↑';
    }
};

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm === "") {
                renderProducts(allProducts);
                return;
            }
            
            const filtered = allProducts.filter(p => 
                (p.name && p.name.toLowerCase().includes(searchTerm)) || 
                (p.category && p.category.toLowerCase().includes(searchTerm)) ||
                (p.description && p.description.toLowerCase().includes(searchTerm))
            );
            
            renderProducts(filtered);
        });
    }
}

// Initialize
loadProducts();