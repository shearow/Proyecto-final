import {chekUserOnline, chekUserCart, chekCountCart} from "./modules-function-var.js";


const toRegister = document.querySelector(".change-to-register");
const toLogin = document.querySelector(".change-to-login");
const registerAndLogin = document.querySelector(".register-and-login");
const loginSubmit = document.querySelector("#login-submit");
const registerSubmit = document.querySelector("#register-submit");
const eyesPassword = document.querySelectorAll(".eye i");

const inputsRegister = document.querySelectorAll(".register-form .container-info input");
const registerPassword1 = document.querySelector("#input-password");
const registerPassword2 = document.querySelector("#input-re-password");

class User {
    constructor(nombre,apellido,email,password) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
    }
}

const regExp = {
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^[a-zA-ZÀ-ÿ0-9\s]{4,12}$/
}

/////////////////////////////////////////////////////////

initializeLocalStorage();
chekUserOnline();
chekUserCart();
chekCountCart();

// IF USER IS ONLINE, REDIRECTED TO INDEX.
if(localStorage.userOnline){
    location.href = "index.html";
}

/////////////////////////////////////////////////////////

//-----------------------------------------------------------------------
/***** LOGIN *****/

// LOGIN - EVENTS:
//%%%%%%%%%%

loginSubmit.addEventListener("click", (e) => {
    e.preventDefault();

    const validateUser = validateLogin();
    
    if(validateUser !== undefined){
        document.querySelector(".success-login").classList.add("active");
        setTimeout( () => document.querySelector(".success-login").classList.remove("active"),4000);
        localStorage.setItem("userOnline", JSON.stringify(validateUser));
        chekUserOnline();
        location.href = "index.html";
    } else {
        document.querySelector(".error-login").classList.add("active");
        setTimeout( () => document.querySelector(".error-login").classList.remove("active"),4000);
    }
});

// LOGIN - FUNCTIONS:
//%%%%%%%%%%

function validateLogin() {
    const emailInput = document.querySelector("#login-email");
    const passwordInput = document.querySelector("#login-password");
    const dataLocalStorage = JSON.parse(localStorage.getItem("users"));

    return dataLocalStorage.find(user => user.email === emailInput.value.toLowerCase() && user.password === passwordInput.value);
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
/***** REGISTER *****/

// REGISTER - EVENTS:
//%%%%%%%%%%

// Move to section register.
toRegister.addEventListener("click", function() {
    registerAndLogin.style.transform = "translateX(-50%)";
});

// Move to section login.
toLogin.addEventListener("click", function() {
    registerAndLogin.style.transform = "translateX(0%)";
});

// Press EYE to Show/Hide password.
eyesPassword.forEach(eye => {
    eye.addEventListener("click", function() {
        if(eye.parentElement.firstElementChild.type === "password"){
            eye.parentElement.firstElementChild.type = "text";
        } else if(eye.parentElement.firstElementChild.type === "text") {
            eye.parentElement.firstElementChild.type = "password";
        }
    });
});

// Form inputs validate keyup content
inputsRegister.forEach(input => {
    input.addEventListener("keyup", () => validateRegisterInput(input));
});

registerSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    
    if(validateRegisterSubmit() === true){
        Swal.fire({
            html: '<div class="successReg"><h3>REGISTRO EXITOSO</h3><p>Gracias por registrarte.</p><a href="register.html">Iniciar Sesión</a></div>',
            imageUrl: '/img/dog-hi.png',
            imageWidth: 'auto',
            imageHeight: 300,
            heightAuto: 'false',
            showConfirmButton: false,
            showCloseButton: true
          })
       /*  document.querySelector(".success-submit").classList.add("active");
        setTimeout( () => document.querySelector(".success-submit").classList.remove("active"), 4000); */        
        pushInArrayLocalStorage("users", crearUser()); // save in local storage users, new user
        document.querySelector(".register-form").reset();
    } else {
        document.querySelector(".error-submit").classList.add("active");
        setTimeout( () => document.querySelector(".error-submit").classList.remove("active"), 4000);
        return;
    }
});


// REGISTER - FUNCTIONS:
//%%%%%%%%%%

// Validate the field if the expReg is true and if it is not empty. If it is not fulfilled, 
// it adds class (not-valid) and if it is fulfilled, it eliminates it.
function validateRegisterInput(input) {    
    if(input.dataset.tag === "name" || input.dataset.tag === "surname") {
        inputChangesKeyup(input, (regExp.name.test(input.value) || input.value === ""));
    }
    if(input.dataset.tag === "email") {
        inputChangesKeyup(input, ((regExp.email.test(input.value) || input.value === "")) && emailNotExists(input.value));
    }
    if(input.dataset.tag === "password") {
        inputChangesKeyup(input.parentElement, regExp.password.test(input.value) || input.value === "");
        validatePassword2();
    }
    if(input.dataset.tag === "password2") {
        validatePassword2();
    }
}

function inputChangesKeyup(inp, boolean){
    if(boolean){
        inp.parentElement.classList.remove("not-valid");
    } else {
        inp.parentElement.classList.add("not-valid");
    }
}

function validatePassword2() {
    if(registerPassword2.value === registerPassword1.value){
        inputChangesKeyup(registerPassword2.parentElement, true);
    } else {
        inputChangesKeyup(registerPassword2.parentElement, false);
    }
}

function validateRegisterSubmit(){
    const validateCamps = {
        name: false,
        surname: false,
        email: false,
        password: false,
        password2: false
    }

    inputsRegister.forEach(input => {
        switch(input.dataset.tag){
            case "name":
                validateCamps.name = (regExp.name.test(input.value));
                break;
            case "surname":
                validateCamps.surname = (regExp.name.test(input.value));
                break;
            case "email":
                validateCamps.email = (regExp.email.test(input.value) && emailNotExists(input.value));
                break;
            case "password":
                validateCamps.password = (regExp.password.test(input.value) && (registerPassword1.value === registerPassword2.value));
                break;
            case "password2":
                validateCamps.password2 = (registerPassword1.value === registerPassword2.value);
                break;
            default:
                return;
        }
    });

    if(validateCamps.name && validateCamps.surname && validateCamps.email && 
        validateCamps.password && validateCamps.password2){
        return true;
    } else {
        return false;
    }
}

function emailNotExists(email){
    const dataLocalStorage = JSON.parse(localStorage.getItem("users"));
    return !dataLocalStorage.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function crearUser(){
    return new User(
        document.querySelector("#input-name").value.toLowerCase(),
        document.querySelector("#input-surname").value.toLowerCase(),
        document.querySelector("#input-email").value.toLowerCase(),
        document.querySelector("#input-password").value
    );
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
/***** LOCALSTORAGE *****/

function initializeLocalStorage(){
    // IF NOT EXISTS "users" IN localStorage -> create. ELSE -> go.
    if(!JSON.parse(localStorage.getItem("users"))){    
        localStorage.setItem("users", JSON.stringify([]));

        // And create admin to test every time.
        const adminLocalStorage = new User("Nicolás", "Bietti", "admin@hotmail.com", "admin");
        localStorage.setItem("users", JSON.stringify([adminLocalStorage]));
    }
}

// Function push (item) in array (key) - localStorage.
function pushInArrayLocalStorage(key, item){
    const takeKey = JSON.parse(localStorage.getItem(key));
    takeKey.push(item);
    localStorage.setItem(key, JSON.stringify(takeKey));
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------