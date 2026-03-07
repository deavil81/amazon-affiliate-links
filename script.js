const products = [
{
name:"Wireless Headphones",
description:"Premium sound quality with long battery life.",
image:"https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
link:"#"
},
{
name:"Smart Watch",
description:"Track fitness, calls and notifications.",
image:"https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
link:"#"
},
{
name:"Gaming Mouse",
description:"High precision mouse for gaming.",
image:"https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
link:"#"
},
{
name:"Bluetooth Speaker",
description:"Loud bass and portable design.",
image:"https://images.unsplash.com/photo-1519677100203-a0e668c92439",
link:"#"
}
]

const container=document.getElementById("products")

products.forEach(product=>{

container.innerHTML+=`

<div class="product">

<img src="${product.image}">

<h3>${product.name}</h3>

<p>${product.description}</p>

<a class="buy-btn" href="${product.link}" target="_blank">
Buy Now
</a>

</div>

`

})
