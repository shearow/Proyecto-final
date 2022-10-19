const burgerOpen = document.querySelector(".burger-open");
const burgerClose = document.querySelector(".burger-close");
const header = document.querySelector("header");
const body = document.querySelector("body");

burgerOpen.addEventListener("click", function(){
    header.classList.toggle("active");
    body.style.overflowY = "hidden";
});

burgerClose.addEventListener("click", function(){
    header.classList.toggle("active");
    body.style.overflowY = "auto";
});

// Block the overflow when the menu is active and fix the error when it is >= 768px.
window.addEventListener('resize', () => {
    if(window.innerWidth >= 768){
        body.style.overflowY = "auto";
    } else if(window.innerWidth < 768 && header.classList.contains("active")) {
        body.style.overflowY = "hidden";
    }
});