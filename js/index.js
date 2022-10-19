import {chekUserOnline, chekUserCart, chekCountCart, modalSweetAddCart, modalSweetGoRegister} from "./modules-function-var.js";

chekUserOnline();
chekUserCart();
chekCountCart();

////////////////////////////////////////////
// ANIMATIONS LIBRERY "scrollreveal".
window.sr = ScrollReveal();

sr.reveal('[data-animate="scrollY"]', {
    duration: 3000,
    delay: 400,
    origin: 'right',
    distance: '-20%',
});
sr.reveal('[data-animate="scrollY2"]', {
    duration: 3000,
    origin: 'left',
    distance: '-20%',
});
sr.reveal('[data-animate="rotate"]', {
    duration: 3000,
    delay: 300,
    origin: 'bottom',
    distance: '-100%',
    rotate: {
        x: 180,
        y: 0,
    },
});
sr.reveal('[data-animate="opacity"]', {
    duration: 3000,
    delay: 600,
    interval: 300,
    opacity: 0,
    origin: 'bottom',
    distance: '-1rem',
});
sr.reveal('[data-animate="opacity2"]', {
    duration: 3000,
    delay: 300,
    interval: 300,
    opacity: 0,
    origin: 'bottom',
    distance: '-1rem',
});

////////////////////////////////////////////
// Carousel Brands

// Change the div to the end of the array.
function start(){
    setInterval(() => {
        const carousel = document.querySelector(".section-brands-container");
        let imgCarousel = document.querySelectorAll(".section-brands-container div");
        
        carousel.append(imgCarousel[0]);
    }, 2000);
}

start();

////////////////////////////////////////////
// SECTION SHOP - CARDS RANDOM POSITION

const sectionShop = document.querySelector(".section-shop-container");
printProducts();

async function printProducts(){
    try {
        const response = await fetch("../json/products.json");
        const data = await response.json();

        const prodFamous = 13; // in this case number, can array(dinamic).
        const div = document.createElement("DIV");
        div.classList.add("section-shop-products");

        for(let i = 0; i < prodFamous; i++){
            div.innerHTML += `
            <div class="shop-product" data-id-shop="${data[i].id}">
                <img src=${data[i].img}>
            </div>
            `;
        }
        sectionShop.append(div);
        animateImages(data);
    } catch(error) {
        console.log(error);
        sectionShop.innerHTML = `Error de carga, intente más tarde.`;
        sectionShop.style.display = "block";
        sectionShop.style.textAlign = "center";
    }
}

function animateImages(totalProducts) {
    const shopImgs = document.querySelectorAll(".shop-product");
    let randomY;
    let randomX;
    let rotate;

    shopImgs.forEach(box => {
        setInterval( () => {
            randomY = Math.floor(Math.random() * (100 - 0 + 1) + 0);     
            randomX = Math.floor(Math.random() * (100 - 0 + 1) + 0);
            rotate = Math.floor(Math.random() * (360 - 0 + 1) + 0);

            box.style.top = `${randomY}%`;
            box.style.left = `${randomX}%`;
            box.style.transform = `translate(-${randomX}%, -${randomY}%) rotate(${rotate}deg)`;
        }, 8000);

        box.addEventListener("click", () => createModal(box, totalProducts));
    });
}

function createModal(box, totalProducts){
    const containerShop = document.querySelector(".section-shop-products");
    const boxId = box.dataset.idShop;
    const prodInfo = totalProducts.find(item => item.id == boxId);

    if(prodInfo){
        const div = document.createElement("DIV");
        div.classList.add("modal-section-shop");

        div.innerHTML = `
        <div class="modal-shop-content-img">
            <img src=${box.firstElementChild.src}><img>
        </div>
        <div class="modal-shop-text">
            <h3>${prodInfo.name}</h3>
            <div class="modal-shop-stars">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
            </div>
            <p>${prodInfo.description}</p>
            <span>$${prodInfo.price}</span>
            <div class="modal-shop-btn">
                <button data-id="${prodInfo.id}">Añadir al carrito</button>
            </div>
        </div>
        <i class="fa-solid fa-x modal-shop-close"></i>
        `;    
        containerShop.append(div);

        /// Close modal
        const x = document.querySelector(".modal-shop-close");
        x.addEventListener("click", () => {
            containerShop.querySelector(".modal-section-shop").remove();
        });

        /// Add to cart
        const btnItem = document.querySelector(".modal-shop-btn button");
        btnItem.addEventListener("click", () => {            
            if(localStorage.userOnline){
                addToCart(prodInfo);
                chekCountCart();
                containerShop.querySelector(".modal-section-shop").remove();
                modalSweetAddCart(prodInfo); 
            } else {
                modalSweetGoRegister();
            }
        });
    }
}

function addToCart(prodInfo){
    const userOnEmail = JSON.parse(localStorage.getItem("userOnline")).email;
    const allCarts = JSON.parse(localStorage.getItem("userCart"));
    const userOnCart = allCarts.find(user => user.userEmail === userOnEmail);
    console.log(userOnCart);

    if(userOnCart.userCart.find(item => item.id == prodInfo.id)){
       userOnCart.userCart.find(item => item.id == prodInfo.id).stock += 1;
    } else {
        userOnCart.userCart.push({
            ...prodInfo,
            stock: 1
        });
    }
    
    localStorage.setItem("userCart", JSON.stringify(allCarts));
}

////////////////////////////////////////////