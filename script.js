const sheetURL =
"https://opensheet.elk.sh/YOUR_GOOGLE_SHEET_ID/1Q9y-CGlebZysgX5Kl5hOAa0H8y8GTP22spqkLPE3GtA";

fetch(sheetURL)
.then(res => res.json())
.then(data => {

const container = document.getElementById("products");

data.forEach(product => {

container.innerHTML += `
<div class="product">

<img src="${product.image}">

<h3>${product.name}</h3>

<p>${product.description}</p>

<a href="${product.link}" class="buy" target="_blank">
Buy Now
</a>

</div>
`;

});

});