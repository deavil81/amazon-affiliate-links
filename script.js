// Google Sheets Configuration
const SHEET_ID = "1Q9y-CGlebZysgX5Kl5hOAa0H8y8GTP22spqkLPE3GtA";
const sheets = ["electronic", "home appliances", "fashion", "fitness"];

// DOM Elements
const productContainer = document.getElementById("products");
const categoryContainer = document.getElementById("categories");

// Store all products
let allProducts = [];

// Load products from Google Sheets
async function loadProducts() {
    console.log("Loading products from Google Sheets...");
    showLoading();
    
    for (const sheet of sheets) {
        const url = `https://opensheet.elk.sh/${SHEET_ID}/${sheet}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(`Loaded ${data.length} products from ${sheet}`);
            
            data.forEach(product => {
                product.category = sheet;
                allProducts.push(product);
            });
            
            createCategory(sheet);
        } catch (error) {
            console.error(`Error loading ${sheet}:`, error);
        }
    }
    
    console.log(`Total products loaded: ${allProducts.length}`);
    
    if (allProducts.length === 0) {
        loadSampleData();
    }
    
    renderSections();
    renderTrendingProducts(allProducts);
    setupSearch();
}

// Sample data
function loadSampleData() {
    console.log("Loading sample data...");
    allProducts = [
        { name: "OnePlus Nord Buds 3r TWS", price: 1999, oldPrice: 3999, category: "electronic", description: "TWS Earbuds up to 54 Hours Playback", image: "https://via.placeholder.com/200x200?text=OnePlus+Buds", link: "#" },
        { name: "Carrier 1.5 Ton AC", price: 34990, oldPrice: 49990, category: "electronic", description: "3 Star Wi-Fi Smart Inverter Split AC", image: "https://via.placeholder.com/200x200?text=Carrier+AC", link: "#" },
        { name: "Samsung 1.5 Ton AC", price: 36490, oldPrice: 52990, category: "electronic", description: "Bespoke AI Inverter Smart Split AC", image: "https://via.placeholder.com/200x200?text=Samsung+AC", link: "#" },
        { name: "Voltas 1.5 Ton AC", price: 38490, oldPrice: 54990, category: "electronic", description: "3 star inverter Split AC", image: "https://via.placeholder.com/200x200?text=Voltas+AC", link: "#" },
        { name: "Noise Master Buds 2", price: 9999, oldPrice: 19999, category: "electronic", description: "51dB Adaptive ANC", image: "https://via.placeholder.com/200x200?text=Noise+Buds", link: "#" },
        { name: "Cotton Printed Skirt", price: 389, oldPrice: 999, category: "fashion", description: "Women's Jaipuri Cotton Printed Skirt", image: "https://via.placeholder.com/200x200?text=Skirt", link: "#" },
        { name: "Women Anarkali Kurti", price: 699, oldPrice: 1999, category: "fashion", description: "Long A-Line Flared Ethnic Kurti", image: "https://via.placeholder.com/200x200?text=Anarkali", link: "#" },
        { name: "Mini AC Air Cooler", price: 499, oldPrice: 1999, category: "home appliances", description: "Portable Mini Fan Cooler", image: "https://via.placeholder.com/200x200?text=Mini+AC", link: "#" }
    ];
}

function showLoading() {
    if (productContainer) {
        productContainer.innerHTML = '<div class="loading" style="text-align:center;padding:40px;">Loading products... 🔄</div>';
    }
}

function renderSections() {
    if (allProducts.length === 0) return;
    
    const topDeals = allProducts.slice(0, 8);
    const bestSellers = allProducts.slice(4, 12);
    const budgetDeals = allProducts.filter(p => Number(p.price) <= 999);
    
    renderCustomWithViewMore(topDeals, "topDeals", "🔥 Top Deals Today");
    renderCustomWithViewMore(bestSellers, "bestSellers", "⭐ Best Sellers");
    renderCustomWithViewMore(budgetDeals, "budgetDeals", "💰 Deals Under ₹999");
}

function renderCustomWithViewMore(products, containerID, sectionTitle) {
    const container = document.getElementById(containerID);
    if (!container) return;
    
    const itemsToShow = 4;
    const hasMore = products.length > itemsToShow;
    const visibleProducts = products.slice(0, itemsToShow);
    const hiddenProducts = products.slice(itemsToShow);
    
    container.innerHTML = "";
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'section-header';
    headerDiv.innerHTML = `<h2>${sectionTitle}</h2>`;
    container.appendChild(headerDiv);
    
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
    
    container.appendChild(gridDiv);
    
    if (hasMore) {
        const viewMoreDiv = document.createElement('div');
        viewMoreDiv.className = 'view-more-container';
        viewMoreDiv.innerHTML = `
            <button class="view-more-btn" onclick="toggleSection('${containerID}')">
                View More (${hiddenProducts.length} more) ↓
            </button>
        `;
        container.appendChild(viewMoreDiv);
        window[`${containerID}_hiddenCount`] = hiddenProducts.length;
    }
}

function createProductElement(product) {
    const div = document.createElement('div');
    div.className = 'product';
    
    const price = Number(product.price) || 0;
    const oldPrice = Number(product.oldPrice) || 0;
    const discount = oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
    
    div.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/200x200?text=Product'}" alt="${product.name || 'Product'}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x200?text=Image+Error'">
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

window.toggleSection = function(containerID) {
    const container = document.getElementById(containerID);
    if (!container) return;
    
    const hiddenProducts = container.querySelectorAll('.hidden-product');
    const button = container.querySelector('.view-more-btn');
    if (!button) return;
    
    const isExpanded = button.textContent.includes('Show Less');
    
    if (isExpanded) {
        hiddenProducts.forEach(product => product.classList.add('hidden-product'));
        const hiddenCount = window[`${containerID}_hiddenCount`] || hiddenProducts.length;
        button.textContent = `View More (${hiddenCount} more) ↓`;
    } else {
        hiddenProducts.forEach(product => product.classList.remove('hidden-product'));
        button.textContent = 'Show Less ↑';
        setTimeout(() => button.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
};

function createCategory(category) {
    if (!categoryContainer) return;
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    categoryDiv.onclick = () => filterCategory(category);
    
    const emoji = { 'electronic': '⚡', 'home appliances': '🏠', 'fashion': '👗', 'fitness': '💪' }[category] || '📦';
    const displayName = { 'electronic': 'Electronics', 'home appliances': 'Home Appliances', 'fashion': 'Fashion', 'fitness': 'Fitness' }[category] || category;
    
    categoryDiv.innerHTML = `${emoji} ${displayName}`;
    categoryContainer.appendChild(categoryDiv);
}

window.filterCategory = function(category) {
    const filtered = allProducts.filter(p => p.category === category);
    renderTrendingProducts(filtered);
    if (productContainer) productContainer.scrollIntoView({ behavior: 'smooth' });
};

window.filterCategoryFromCard = function(category) {
    const filtered = allProducts.filter(p => p.category === category);
    renderTrendingProducts(filtered);
    if (productContainer) productContainer.scrollIntoView({ behavior: 'smooth' });
};

function renderTrendingProducts(products) {
    if (!productContainer) return;
    
    productContainer.innerHTML = "";
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'section-header';
    headerDiv.innerHTML = `<h2>🔥 Trending Products</h2>`;
    productContainer.appendChild(headerDiv);
    
    if (!products || products.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = '<p style="text-align:center;padding:40px;">🔍 No products found. Try "AC" or "Buds"</p>';
        productContainer.appendChild(noResults);
        return;
    }
    
    const itemsToShow = 6;
    const hasMore = products.length > itemsToShow;
    const visibleProducts = products.slice(0, itemsToShow);
    const hiddenProducts = products.slice(itemsToShow);
    
    const gridDiv = document.createElement('div');
    gridDiv.className = 'product-grid';
    
    visibleProducts.forEach(product => gridDiv.appendChild(createProductElement(product)));
    hiddenProducts.forEach(product => {
        const productEl = createProductElement(product);
        productEl.classList.add('hidden-product');
        gridDiv.appendChild(productEl);
    });
    
    productContainer.appendChild(gridDiv);
    
    if (hasMore) {
        const viewMoreDiv = document.createElement('div');
        viewMoreDiv.className = 'view-more-container';
        viewMoreDiv.innerHTML = `<button class="view-more-btn" onclick="toggleTrendingSection()">View More (${hiddenProducts.length} more) ↓</button>`;
        productContainer.appendChild(viewMoreDiv);
        window.trendingProducts = products;
        window.trendingHiddenCount = hiddenProducts.length;
    }
}

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

// SEARCH WITH BUTTON - FIXED
function setupSearch() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput || !searchBtn) {
        console.log("Search elements not found!");
        return;
    }
    
    console.log("Search setup complete with button");
    
    // Search when button is clicked
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    // Also search when Enter key is pressed
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        console.log("Searching for:", searchTerm);
        
        if (searchTerm === "") {
            renderTrendingProducts(allProducts);
            return;
        }
        
        const filtered = allProducts.filter(product => {
            const nameMatch = product.name && product.name.toLowerCase().includes(searchTerm);
            const categoryMatch = product.category && product.category.toLowerCase().includes(searchTerm);
            const descMatch = product.description && product.description.toLowerCase().includes(searchTerm);
            return nameMatch || categoryMatch || descMatch;
        });
        
        console.log(`Found ${filtered.length} products for "${searchTerm}"`);
        renderTrendingProducts(filtered);
        
        // Scroll to results
        if (productContainer) {
            productContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize
loadProducts();