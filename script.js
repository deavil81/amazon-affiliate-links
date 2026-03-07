const sheetURL =
"https://opensheet.elk.sh/YOUR_SHEET_ID/1Q9y-CGlebZysgX5Kl5hOAa0H8y8GTP22spqkLPE3GtA";

const productContainer =
document.getElementById("products");

const categoryContainer =
document.getElementById("categories");

let categories = new Set();

fetch(sheetURL)
.then(res => res.json())
.then(data => {

data.forEach(product => {

categories.add(product.category)

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

categories.forEach(cat => {

categoryContainer.innerHTML += `

<div class="category">
${cat}
</div>

`;

});

});
