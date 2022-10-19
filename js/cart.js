import {chekUserOnline, chekUserCart, chekCountCart} from "./modules-function-var.js";

const containerProducts = document.querySelector(".cart-page-products");
const containerPay = document.querySelector(".cart-page-container");
const fullUsersCart = JSON.parse(localStorage.getItem("userCart"));

chekUserOnline();
chekUserCart();
chekCountCart();

// if user is online -> show content
if(localStorage.userOnline){
    const userOn = JSON.parse(localStorage.getItem("userOnline")).email;
    const userOnCart = fullUsersCart.find(user => user.userEmail === userOn).userCart;    
    
    chekCarritoCount(userOnCart);
    printProducts(userOnCart);
    printPay(userOnCart);

    //////////////////////////////
    // Delete Cart items (trash).
    const btnDeleteItemCart = document.querySelectorAll(".cart-page-icon");
    
    btnDeleteItemCart.forEach(item => {
        item.addEventListener("click", () => {
            const itemId = item.parentElement.parentElement.dataset.id;

            if(userOnCart.find(item => item.id == itemId)){
                const indexProduct = userOnCart.indexOf(userOnCart.find(item => item.id == itemId));                
                userOnCart.splice(indexProduct,1);

                item.parentElement.parentElement.classList.add("active");
                setTimeout( () => {
                    item.parentElement.parentElement.classList.remove("active");
                    item.parentElement.parentElement.remove();
                }, 600);
                
                localStorage.setItem("userCart", JSON.stringify(fullUsersCart));
                chekCarritoCount(userOnCart);
                calculateTotalPay(userOnCart);
                chekCountCart();
            }
        });
    });

    //////////////////////////////
    // Delete All Cart items (trash).
    const btnDeleteAllCart = document.querySelector(".carrito-count button");

    btnDeleteAllCart.addEventListener("click", () => {
        if(userOnCart.length > 0){
            userOnCart.splice(0, userOnCart.length);
        }        
        containerProducts.innerHTML = '';

        localStorage.setItem("userCart", JSON.stringify(fullUsersCart));
        chekCarritoCount(userOnCart);
        calculateTotalPay(userOnCart);
        chekCountCart();
    });  
    
    //////////////////////////////
    // Reduce or increase the quantity of the product in the cart.
    const containerCartCant = document.querySelectorAll(".cart-cant-container");

    containerCartCant.forEach(opt => {
        const reduceCant = opt.querySelector(".cart-reduce");
        const increaseCant = opt.querySelector(".cart-increase");
        const inputCant = opt.querySelector("input");
        
        const validateInputCant = /^[1-9]{1}\d*$/;
        const itemIdCart = opt.parentElement.parentElement.dataset.id;
        
        // Reduce input product Cart.
        reduceCant.addEventListener("click", () => {
            if(validateInputCant.test(Number(inputCant.value))){
                if(Number(inputCant.value) > 1){
                    inputCant.value--;
                    
                    updateStockCart();
                    calculateTotalPay(userOnCart);
                }            
            } else {
                inputCant.value = 1;
            }            
        });

        // Increase input product Cart.
        increaseCant.addEventListener("click", () => {
            if(validateInputCant.test(Number(inputCant.value))){
                if(Number(inputCant.value) >= 1){
                    inputCant.value++;

                    updateStockCart();
                    calculateTotalPay(userOnCart);
                }
            } else {
                inputCant.value = 1;
            }
        });

        inputCant.addEventListener("change", () => {
            if(!validateInputCant.test(Number(inputCant.value))){
                inputCant.value = 1;
            }
                
            updateStockCart();
            calculateTotalPay(userOnCart);
        });

        function updateStockCart(){
            const itemIdIndex = userOnCart.indexOf(userOnCart.find(item => item.id == itemIdCart));
            
            userOnCart[itemIdIndex].stock = inputCant.value;
            localStorage.setItem("userCart", JSON.stringify(fullUsersCart));
        }
    });

}

function printProducts(userCart2){
    userCart2.forEach(producto => {
        const div = document.createElement("DIV");
        div.classList.add("cart-page-product");
        div.dataset.id = `${producto.id}`;

        div.innerHTML = `
            <div class="cart-page-img">
                <img src=${producto.img} alt="producto imagen">
            </div>
            <div class="cart-page-name">
                <h3>${producto.name}</h3>
                                                        
                <div class="cart-page-product-value">
                    <p>$ ${producto.price}</p>
                </div>
                <span>Envío gratis</span>
            </div>
            <div class="cart-page-options">
                <div class="cart-page-icon">
                    <i class="fa-solid fa-trash-can"></i>
                </div>
                <div class="cart-cant-container">
                    <p class="cart-reduce">-</p>
                    <input type="number"  min="1" value="${producto.stock}">
                    <p class="cart-increase">+</p>
                </div>
            </div>
        `;
        containerProducts.append(div);
    });    
}

function printPay(userCart){    
    const div = document.createElement("DIV");
    
    div.classList.add("cart-page-total-value");
    div.innerHTML = `
        <p class="resume">Resumen</p>
        <p class="cart-total-value">Total a pagár: </p>
        <span>$ </span>
        <button type="submit">Pagar</button>
    `;
    containerPay.append(div);
    calculateTotalPay(userCart);
}

function calculateTotalPay(userCart){
    const totalAPagarContainer = document.querySelector(".cart-page-total-value span");
    const totalPay = userCart.reduce((total, prod) => total + (prod.price * prod.stock),0);

    totalAPagarContainer.innerHTML = `$${totalPay}`;
}

function chekCarritoCount(userOnCart){
    const carritoCount = document.querySelector(".carrito-count span");
    carritoCount.innerHTML = userOnCart.length;
}