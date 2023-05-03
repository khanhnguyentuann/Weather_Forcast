function initMap() {
    var map = L.map('map', { zoomControl: false }).setView([14.0583, 108.2772], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18 }).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);
}
document.addEventListener('DOMContentLoaded', initMap);

$(document).ready(function () {
    function handleFormSubmission(event, url, data, successCallback) {
        event.preventDefault();
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: successCallback
        });
    }

    $('#login-form').submit(function (event) {
        var username = $('#username').val();
        var password = $('#password').val();
        handleFormSubmission(event, 'http://localhost:5000/check-login', { username: username, password: password }, function (response) {
            if (response == 'success') {
                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('username', username);
                window.location.href = 'main.html';
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng.');
            }
        });
    });

    $('#register-form').submit(function (event) {
        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();

        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp.');
            return;
        }

        handleFormSubmission(event, 'http://localhost:5000/register', { username: username, email: email, password: password }, function (response) {
            if (response == 'success') {
                alert('Đăng ký thành công!');
                window.location.href = 'login.html';
            } else {
                alert('Tên người dùng đã tồn tại. Vui lòng chọn tên đăng nhập khác.');
            }
        });
    });

    $('.facebook-login').click(function () {
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me', function (response) {
                    console.log('Good to see you, ' + response.name + '.');
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, { scope: 'public_profile,email' });
    });

    window.fbAsyncInit = function () {
        FB.init({ appId: '944575006963713', cookie: true, xfbml: true, version: 'v12.0' });
        FB.AppEvents.logPageView();
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id; js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    $('#register-link').click(function () { window.location.href = 'register.html'; });
    $('#login-link').click(function () { window.location.href = 'login.html'; });
});
