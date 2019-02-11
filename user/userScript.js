//vacancy switch
let jobs = document.querySelectorAll('.main__job-container');
let barberJob = document.querySelector('.barber-job');
let adminJob = document.querySelector('.admin-job');

barberJob.addEventListener('click', function() {
    jobs[1].classList.remove('main__job-container--active');
    jobs[0].classList.add('main__job-container--active');

    adminJob.classList.remove('job-list__item--active');
    barberJob.classList.add('job-list__item--active');
    
});

adminJob.addEventListener('click', function() {
    jobs[0].classList.remove('main__job-container--active');
    jobs[1].classList.add('main__job-container--active');

    barberJob.classList.remove('job-list__item--active');
    adminJob.classList.add('job-list__item--active');
});


// wrapping text into P element
let pGenerator = function(value) {
    let p = document.createElement('p');
    p.textContent = value;
    return p;
}


// render welcome msg!
let logInMenu = (function () {
    let loginHi = document.querySelector('.sign-in__log-in');
    let loggedInUserName = pGenerator(localStorage.getItem('_lastUserLoggedIn'));
    loginHi.innerText = `Добро пожаловать,\n` + loggedInUserName.textContent + `!`;
})();


// deleting apppointment block and data from DB
function renderDeleteAppointment(item, currentAppointment) {
    let closeButton = document.createElement('span');
    closeButton.classList.add('small-close');
    closeButton.innerHTML = `&times;`;
    closeButton.addEventListener('click', function() {
        item.style.display="none";
    });
    closeButton.addEventListener('click', function() {
        let xhr = new XMLHttpRequest();
        let data = {};
        data.login = localStorage.getItem('_lastUserLoggedIn');
        data.date = currentAppointment.date;
        data.time = currentAppointment.time;
        data.service = currentAppointment.service;
        let result = (JSON.stringify(data));
        xhr.open('POST', 'http://127.0.0.1:3000/deleteApp', true);
        xhr.onreadystatechange = function() {
            if (xhr.status === 200 && xhr.readyState === 4) {
                alert('Вы удалили запись на приём!');
            } else if (xhr.readyState === 4) {
                alert('Вам не удалось удалить запись на приём!');
                alert(xhr.responseText);
            }
        }
        xhr.send(result); 
    });
    item.appendChild(closeButton);
}


//getting appointemts for render
let getMyAppointments = function() {
    let currentUser = localStorage.getItem('_lastUserLoggedIn');
    let xhr = new XMLHttpRequest();   
    let result = JSON.stringify({login : currentUser});
    xhr.open('POST', 'http://127.0.0.1:3000/apps', true);
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let appointmentsArray = JSON.parse(xhr.responseText);
            renderMyAppointments(appointmentsArray);
        }
    }
    xhr.send(result);   
}


//rendering appointment blocks
let renderMyAppointments = function(array) {
    let personalBlock = document.querySelector('.personal-block');
    let appointmentBlock = document.createElement('div');
    appointmentBlock.classList.add('appointmentBlock', 'bordered');
    personalBlock.appendChild(appointmentBlock);
    if (array.length == 0) {
        appointmentBlock.innerText = `Вы пока никуда не записаны=( \nНужно срочно это исправить!`;
    } else {
        array.forEach(item => { 
            let appointmentBox = document.createElement('div');
            appointmentBox.classList.add('appointment-box');
            let appointmentDate = pGenerator(item.date);
            let appointmentTime = pGenerator(item.time);
            let appointmentService = pGenerator(item.service);
            let hr = document.createElement('hr');
            appointmentBox.innerText = `Вы записаны:\n` + appointmentDate.textContent + `\nв ` + appointmentTime.textContent + `\nна ` + appointmentService.textContent;
            appointmentBox.appendChild(hr);
            renderDeleteAppointment(appointmentBox, item);
            appointmentBlock.appendChild(appointmentBox);
        });
    }
}


//event listeners on "Мои сеансы"
//@TODO отрисовывает блок только со 2 клика
let myAppointments = document.querySelector('.personal-menu__item');
myAppointments.addEventListener('click', getMyAppointments);
myAppointments.addEventListener('click', function(evt) {
    let appointmentBlock = document.querySelector('.appointmentBlock');
    appointmentBlock.classList.toggle('visible-flex');
});


// jquery datepicker
$( "#datepicker" ).datepicker({
    inline: true,
    dateFormat: "dd.mm.yy",
    firstDay: 1,
    dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
    monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ],  
    maxDate: '+1m',
    minDate: '-0d'
});


//create appointment
let appoint = function(evt) { 
    evt.preventDefault();
    let login = localStorage.getItem('_lastUserLoggedIn');
    let date = document.querySelector('input[name = date]');
    let time = document.querySelector('select[name = time]');
    let service = document.querySelector('select[name = service]');
    let data = {};
    data.login = login;
    data.date = date.value;
    data.time = time.value;
    data.service = service.value;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:3000/createApp', true);
    let result = JSON.stringify(data);
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            alert('Вы записались на приём! Проверьте запись в разделе "Мои cеансы"!');
            window.location.replace('file:///C:/Users/George/Desktop/barbershop-master/user/index.html');
        } else if (xhr.readyState === 4) {
            alert('Вам не удалось записаться на приём!');
            alert(xhr.responseText);
        }
    }
    xhr.send(result); 
}


//add event listener on a create app form button
let createAppButton = document.querySelector('.form__btn');
createAppButton.addEventListener('click', appoint);
