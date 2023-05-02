function initMap() {
    var map = L.map('map', { zoomControl: false }).setView([14.0583, 108.2772], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18 }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
}

document.addEventListener('DOMContentLoaded', initMap);

$(document).ready(function () {
    // Xử lý form đăng nhập
    $('#login-form').submit(function (event) {
        event.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        // Gửi yêu cầu Ajax đến máy chủ để kiểm tra thông tin đăng nhập
        $.ajax({
            url: 'http://localhost:5000/check-login',
            type: 'POST',
            data: { username: username, password: password },
            success: function (response) {
                // Nếu kết quả trả về là "success", chuyển hướng đến trang chính
                if (response == 'success') {
                    sessionStorage.setItem('loggedIn', 'true');
                    sessionStorage.setItem('username', username);
                    window.location.href = 'main.html';
                } else {
                    // Ngược lại, hiển thị thông báo lỗi
                    alert('Tên đăng nhập hoặc mật khẩu không đúng.');
                }
            }
        });
    });

    // Xử lý form đăng ký
    $('#register-form').submit(function (event) {
        event.preventDefault();

        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm-password').val();

        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp.');
            return;
        }

        $.ajax({
            url: 'http://localhost:5000/register',
            type: 'POST',
            data: {
                username: username,
                email: email,
                password: password
            },
            success: function (response) {
                if (response == 'success') {
                    alert('Đăng ký thành công!');
                    window.location.href = 'login.html';
                } else {
                    alert('Tên người dùng đã tồn tại. Vui lòng chọn tên đăng nhập khác.');
                }
            }
        });
    });

    $('.facebook-login').click(function () {
        FB.login(
            function (response) {
                if (response.authResponse) {
                    // Người dùng đã đăng nhập thành công bằng Facebook
                    // Bạn có thể lấy thông tin người dùng và xử lý tiếp theo
                    FB.api('/me', function (response) {
                        console.log('Good to see you, ' + response.name + '.');
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            },
            { scope: 'public_profile,email' }
        );
    });

    window.fbAsyncInit = function () {
        FB.init({
            appId: '944575006963713',
            cookie: true,
            xfbml: true,
            version: 'v12.0',
        });
    
        FB.AppEvents.logPageView();
    };
    
    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
    

    $('#register-link').click(function () {
        window.location.href = 'register.html';
    });

    $('#login-link').click(function () {
        window.location.href = 'login.html';
    });
});
