const SHEET_ID = "1Q9y-CGlebZysgX5Kl5hOAa0H8y8GTP22spqkLPE3GtA";

const sheets = [
"electronic",
"home appliances",
"fashion",
"fitness"
];

const productContainer =
document.getElementById("products");

const categoryContainer =
document.getElementById("categories");

let allProducts = [];

async function loadProducts(){

for(const sheet of sheets){

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${sheet}`;

const res = await fetch(url);

const data = await res.json();

data.forEach(product => {

product.category = sheet;

allProducts.push(product);

});

createCategory(sheet);

}

renderProducts(allProducts);

}

function createCategory(category){

categoryContainer.innerHTML += `

<div class="category"
onclick="filterCategory('${category}')">

${category}

</div>

`;

}

function renderProducts(products){

productContainer.innerHTML = "";

products.forEach(product => {

productContainer.innerHTML += `

<div class="product">

<img src="${product.image}">

<h3>${product.name}</h3>

<p>${product.description}</p>

<p class="price">₹${product.price}</p>

<a href="${product.link}" class="buy" target="_blank">
View Deal
</a>

</div>

`;

});

}

function filterCategory(category){

const filtered =
allProducts.filter(p => p.category === category);

renderProducts(filtered);

}

loadProducts();
