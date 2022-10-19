import {chekUserOnline, chekUserCart, chekCountCart} from "./modules-function-var.js";

chekUserOnline();
chekUserCart();
chekCountCart();

const imagenes = document.querySelectorAll(".img-about-page img");
const body = document.querySelector("body");

imagenes.forEach(img => {
    img.addEventListener("click", () => {
        const div = document.createElement("DIV");
        div.innerHTML = `
        <img class="full-img" src="${img.src}">
        <i class="fa-solid fa-x"></i>
        `;

        div.classList.add("full-img-content");
        body.append(div);

        
        const x = document.querySelector(".full-img-content i");
        x.addEventListener("click", () => {
            document.querySelector(".full-img-content").remove();
        });
    });
});