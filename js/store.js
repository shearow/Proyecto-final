import {chekUserOnline, chekUserCart, chekCountCart, modalSweetAddCart, modalSweetGoRegister} from "./modules-function-var.js";

chekUserOnline();
chekUserCart();
chekCountCart();

const filterBtnMenu = document.querySelector(".filters-menu");
const filterOpt = document.querySelector(".filter-opt");
const containerProducts = document.querySelector(".store-products-container");
let products = [];

filterBtnMenu.addEventListener("click", () => {
    filterOpt.classList.toggle("active");
});


///////////////////////////////////////////////////////////////
// Call Products / Print.

totalProducts();

async function totalProducts(){
    try{
        const responsive = await fetch("../json/products.json");
        const data = await responsive.json();

        products = data;
        activityProducts();
    } catch(error) {
        console.log(`Ha ocurrido un error: ${error.message}`);
        document.querySelector(".store-products").innerHTML = `<p class="error-products">Ha ocurrido un error, intenta más tarde.</p>`;
    }
}

function activityProducts(){
    printProducts();

    ///////////////////////////////////////////
    // Btn buy product event -> Add to cart.
    const btnsBuyProd = document.querySelectorAll(".store-product-btn");

    btnsBuyProd.forEach(btn => {
        btn.addEventListener("click", () => {
            if(!localStorage.userOnline){
                modalSweetGoRegister();
            }else {
                addToCart(btn.parentElement);
            }
        });
    });
}

function printProducts(){
    products.forEach(item => {
        const div = document.createElement("DIV");
        div.classList.add("store-product", "active");
        div.innerHTML = `
             <div class="store-product-img">
                <img src="${item.img}" alt="producto imágen">
             </div>
             <div class="store-product-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span>$${item.price}</span>
                <div class="store-product-btn-container">
                    <button class="store-product-btn" data-id="${item.id}">Comprar</button>
                </div>
             </div>
        `;
        containerProducts.append(div);
    });
}

function addToCart(item) {
    const btnId = parseInt(item.querySelector("button").dataset.id);
    const located = products.find(prod => prod.id == btnId);
    const localStoreUserOn = JSON.parse(localStorage.getItem("userOnline")).email;
    const localStoreCart = JSON.parse(localStorage.getItem("userCart"));
    const indexLSEmail = parseInt(localStoreCart.indexOf(localStoreCart.find(data => data.userEmail === localStoreUserOn)));

    if(located){
        if(localStoreCart[indexLSEmail].userCart.find(item => item.id == btnId)){
            localStoreCart[indexLSEmail].userCart.find(item => item.id == btnId).stock += 1;
        } else {
            localStoreCart[indexLSEmail].userCart.push({
                ...located,
                stock: 1
            });
        }
        
        localStorage.setItem("userCart", JSON.stringify(localStoreCart));        
        modalSweetAddCart(localStoreCart[indexLSEmail].userCart.find(item => item.id == btnId));
    }
    
    chekCountCart();
}

//////////////////////////////////////////
// FILTERS - Search Store Products.
const inputSearch = document.querySelector(".store-search input");

// If product name or product description === Input value -> Show. Else -> Hide.
inputSearch.addEventListener("keyup", (e) => {
    const allProducts = document.querySelectorAll(".store-product");
        
    if(e.key === "Escape"){
        e.target.value = "";
    }

    allProducts.forEach(prod => {        
        if(prod.querySelector("h3").textContent.toLowerCase().includes(e.target.value.toLowerCase())
            || prod.querySelector("p").textContent.toLowerCase().includes(e.target.value.toLowerCase())){
            prod.classList.add("active");
        }else {
            prod.classList.remove("active");
        }
    });
});

//////////////////////////////////////////
// FILTERS - Order by.
const filterOrder = document.querySelector(".store-order select");

filterOrder.addEventListener("change", () => {    
    const duplicateProducts = [...products];

    switch(filterOrder.value){
        case "all":
            containerProducts.innerHTML = "";
            printProducts(duplicateProducts);
            break;       
        case "min-to-max":
            containerProducts.innerHTML = "";
            products.sort( (a,b) => a.price - b.price);
            printProducts(products);
            break;
        case "max-to-min":
            containerProducts.innerHTML = "";
            products.sort( (a,b) => b.price - a.price);
            printProducts(products);
            break;
    }
});

//////////////////////////////////////////
// FILTERS - Category.
const filterCategory = document.querySelector(".category select");

filterCategory.addEventListener("change", () => {
    const allElements = document.querySelectorAll(".store-product");

    allElements.forEach( prod => {
        const prodId = prod.querySelector(".store-product-btn").dataset.id;
        
        switch(filterCategory.value){
            case "all":
                prod.classList.add("active");
                break;
            case "perro":                
                if(products.find(item => item.id == prodId).category.includes("perro")){
                    prod.classList.add("active");
                } else {
                    prod.classList.remove("active");
                }
                break;
            case "gato":
                if(products.find(item => item.id == prodId).category.includes("gato")){
                    prod.classList.add("active");
                } else {
                    prod.classList.remove("active");
                }
                break;
        }
    });
});