import {chekUserOnline, chekUserCart, chekCountCart} from "./modules-function-var.js";

chekUserOnline();
chekUserCart();
chekCountCart();

// IF USER NOT IS ONLINE, REDIRECTED TO REGISTER.
if(!localStorage.userOnline){
    location.href = "register.html";
}

const nameUser = document.querySelector(".user-menu-name");
const dataUserOnline = JSON.parse(localStorage.getItem("userOnline"));

nameUser.innerHTML = `Bienvenido <span>${dataUserOnline.nombre} ${dataUserOnline.apellido}</span> !!!`;