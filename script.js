//vacancy switch
let jobs = document.querySelectorAll(".main__job-container");
let barberJob = document.querySelector(".barber-job");
let adminJob = document.querySelector(".admin-job");

barberJob.addEventListener("click", function() {
    jobs[1].classList.remove("main__job-container--active");
    jobs[0].classList.add("main__job-container--active");

    adminJob.classList.remove("job-list__item--active");
    barberJob.classList.add("job-list__item--active");
    
})

adminJob.addEventListener("click", function() {
    jobs[0].classList.remove("main__job-container--active");
    jobs[1].classList.add("main__job-container--active");

    barberJob.classList.remove("job-list__item--active");
    adminJob.classList.add("job-list__item--active");
});

//remembering last user logged in in localstorage
localStorage.setItem('_lastUserLoggedIn','');

function rememberUserLoggedIn(userName) {
    localStorage.setItem('_lastUserLoggedIn', userName);
}

// toggling login/register windows by click/esc/closebutton
let loginBlock = document.getElementById('loginBlock');

document.addEventListener('click', function(evt) {
    if (evt.target == loginBlock)  {
        loginBlock.style.display = "none";
    }
});

document.addEventListener('keydown', function(evt) {
	if (evt.keyCode === 27) {
    	loginBlock.style.display = "none";
	}
});

let registerBlock = document.getElementById('registerBlock');

window.onclick = function(evt) {
    if (evt.target == registerBlock)  {
        registerBlock.style.display = "none";
    }
}
document.addEventListener('keydown', function(evt) {
	if (evt.keyCode === 27) {
    	registerBlock.style.display = "none";
	}
});


//from login form to register form (if u are new user)
let registerLink = document.querySelector('.register-link');
registerLink.addEventListener('click', function(evt) {
    loginBlock.style.display = "none";
    registerBlock.style.display = "block";
});


// register form
let registerForm = registerBlock.querySelector('.modal-content');
let registerSubmit = registerBlock.querySelector('.btn');
let userField = registerBlock.querySelector('input[type = text]');
let passwordField = registerBlock.querySelector('input[name = psw]');
let repeatedPasswordField = registerBlock.querySelector('input[name = repeat-psw]');
//flag is checking possibility to register on client side
let registerFlag = false; 

repeatedPasswordField.onblur = function(evt) {  
    if (passwordField.value !== repeatedPasswordField.value) {
        repeatedPasswordField.setCustomValidity('Пароли должны совпадать!');
        passwordField.style.border = '2px solid red';
        repeatedPasswordField.style.border = '2px solid red';
        registerFlag = true;
        return registerFlag;
    }
}

//creating user/checking login in DB
let checkRegister = function(evt) {
    evt.preventDefault();
    if (!registerFlag) {
        let result = JSON.stringify({name: userField.value, password: passwordField.value, repeatedPassword: repeatedPasswordField.value});
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:3000/register', true);
        xhr.onreadystatechange = function() {
            if (xhr.status === 200 && xhr.readyState === 4) {
                alert('Вы удачно зарегистрировались и оказались в личном кабинете!');
                rememberUserLoggedIn(JSON.parse(xhr.responseText).login);
                window.location.replace('file:///C:/Users/George/Desktop/barbershop-master/user/index.html');
            } else if (xhr.readyState === 4) {
                alert(xhr.responseText);
                userField.setCustomValidity('Такой аккаунт уже зарегистрирован!');
                userField.style.border = '2px solid red';   
            }
        }
        xhr.send(result); 
    } 
}

registerForm.addEventListener('submit', checkRegister);


// canceling red border when changing missing/wrong fields
userField.oninput = function () {
    registerFlag = false;
    userField.setCustomValidity('');
    userField.style.border = '1px solid #ccc'; 
    return registerFlag;
}

passwordField.oninput = function() {
    registerFlag = false;
    passwordField.setCustomValidity('');
    passwordField.style.border = '1px solid #ccc';
    return registerFlag;
}

repeatedPasswordField.oninput = function() {
    registerFlag = false;
    repeatedPasswordField.setCustomValidity('');
    repeatedPasswordField.style.border = '1px solid #ccc'; 
    return registerFlag;
}

 
// login form
let loginUserField = loginBlock.querySelector('input[type = text]');
let loginPasswordField = loginBlock.querySelector('input[type = password]'); 
let signInBlock = document.querySelector('.sign-in');
let signInItems = signInBlock.querySelectorAll('.sign-in__item');
let mainPage = document.querySelector('.main__page');
let appointmentButton = mainPage.querySelector('.main__button');
let loginForm = loginBlock.querySelector('.modal-content');


//logging in 
let checkLogin = function (evt) {
    evt.preventDefault();
    let xhr = new XMLHttpRequest();
    let result = JSON.stringify({name: loginUserField.value, password: loginPasswordField.value});
    xhr.open('POST', 'http://127.0.0.1:3000/login', true);
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            rememberUserLoggedIn(JSON.parse(xhr.responseText).login);
            window.location.replace('file:///C:/Users/George/Desktop/barbershop-master/user/index.html');
        } else if (xhr.readyState === 4) {
            alert(xhr.responseText);
        }
    }
    xhr.send(result);
}

loginForm.addEventListener('submit', checkLogin);