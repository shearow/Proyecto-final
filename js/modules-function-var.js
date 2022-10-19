
// Chek localStorage, if user is login -> change DOM options to ONLINE USER.
export function chekUserOnline(){
    
    if(localStorage.userOnline) {
        const userSession = document.querySelector(".user-session");
        userSession.firstElementChild.remove();
    
        // replace NAV "INICIAR SESION" to "USER-ONLINE -> NAME".
        const div = document.createElement("DIV");
        div.classList.add("user-session-menu");
        div.innerHTML = `
            <a href="user-menu.html" class="bg-border">
            <i class="fa-solid fa-user avatar-user-session"></i>
            ${JSON.parse(localStorage.getItem("userOnline")).nombre}
            </a>
            <div class="user-session-submenu">
                <div class="user-session-submenu-content">
                    <a href="user-menu.html">Perfil</a>
                    <a href="index.html" class="close-session">Cerrar sesión</a>
                </div>
            </div>`
            ;
        userSession.append(div);

        const div2 = document.createElement("DIV");
        div2.classList.add("close-session-mobile");
        div2.classList.add("close-session");
        div2.innerHTML = `Cerrar Session`;

        document.querySelector(".cart").parentNode.append(div2);

        /////////////////////////////////////////////////////////////////
        // Mouse HOVER in menu, show Submenu
        const userMenu = document.querySelector(".user-session-menu");

        userMenu.addEventListener("mouseover", () => {
        document.querySelector(".user-session-submenu").style.opacity = "1";
            document.querySelector(".user-session-submenu").style.visibility = "visible";
            document.querySelector(".user-session-submenu").style.marginTop = "8rem";
        });

        userMenu.addEventListener("mouseout", () => {
            document.querySelector(".user-session-submenu").style.opacity = "0";
            document.querySelector(".user-session-submenu").style.visibility = "hidden";
            document.querySelector(".user-session-submenu").style.marginTop = "10rem";
        });

        /////////////////////////////////////////////////////////////////
        // ONLINE USER -> Close SESSION.
        const closeSession = document.querySelectorAll(".close-session");

        closeSession.forEach(close => {
            close.addEventListener("click", (e) => {
                e.preventDefault();
    
                localStorage.removeItem("userOnline");
                window.location.reload();
            });
        });
    }
}

export function chekUserCart() {
    if(localStorage.userOnline){
        if(!localStorage.userCart){
            localStorage.setItem("userCart", JSON.stringify([]));
        }
        
        
        const userOn = JSON.parse(localStorage.getItem("userOnline"));
        const localizeCart = JSON.parse(localStorage.getItem("userCart"));
        
        if(!localizeCart.find(user => user.userEmail === userOn.email)){
            localizeCart.push({
                userEmail: userOn.email,
                userCart: []
            });
            localStorage.setItem("userCart", JSON.stringify(localizeCart));
        }
    }    
}

export function chekCountCart() {
    if(localStorage.userOnline){
        const countCartHtml = document.querySelector(".cart span p");
        const userOnMail = JSON.parse(localStorage.getItem("userOnline")).email;
        const localCartUser = JSON.parse(localStorage.getItem("userCart"));
        const indexEmail = parseInt(localCartUser.indexOf(localCartUser.find(data => data.userEmail === userOnMail)));

        countCartHtml.innerHTML = localCartUser[indexEmail].userCart.length;
    }
}

//////////////////////////////////////////
// Alert buy product -> Add to cart.
export function modalSweetAddCart(item){    
    Swal.fire({
        title: 'Agregado al carrito',
        html: `<div class="modalImgCart"><img src="${item.img}"></div>`,
        scrollbarPadding: 'false',
        confirmButtonText: 'Aceptar',
        customClass: {
            title: 'modalTitleCart'
        },
        timer: '2000',
  });
}

export function modalSweetGoRegister(){
    Swal.fire({
        title: 'Tienes que iniciar sesion',
        text: "Inicia sesión para poder agregar productos al carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK, INICIAR SESION'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(            
            location.href = "register.html"
          )
        }
      })
}