document.addEventListener('DOMContentLoaded', initMap);

async function makeRequest(url, data) {
    try {
        const response = await $.ajax({
            url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error("Error response:", error.responseText);
        throw Error(error.responseText);
    }
}

$(document).ready(() => {
    $('#login-form').submit(async (event) => {
        event.preventDefault();
        const email = $('#email').val();
        const password = $("#password").val();
        const rememberMe = $("#remember-me").is(":checked");

        try {
            const response = await makeRequest('http://localhost:3333/api/v1/auth/login', { email, password, rememberMe });
            alert(response.message);
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('email', email);
            if (rememberMe) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
            }
            window.location.href = 'main.html';
        } catch (error) {
            alert(error.message);
        }
    });

    $('#register-form').submit(async (event) => {
        event.preventDefault();
        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const response = await makeRequest('http://localhost:3333/api/v1/auth/register', { name, email, password });
            alert(response.message);
            window.location.href = 'login.html';
        } catch (error) {
            alert(error.message);
        }
    });
});

function initMap() {
    const map = L.map('map', { zoomControl: false }).setView([14.0583, 108.2772], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);
}