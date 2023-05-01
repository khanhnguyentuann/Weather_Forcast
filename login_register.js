function initMap() {
    var map = L.map('map', { zoomControl: false }).setView([14.0583, 108.2772], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
}

document.addEventListener('DOMContentLoaded', initMap);

$(document).ready(function() {
    // Xử lý form đăng nhập
    $('#login-form').submit(function(event) {
        event.preventDefault();
        sessionStorage.setItem('loggedIn', 'true');
        window.location.href = 'main.html';
    });

    // Xử lý chuyển hướng đến trang đăng ký
    $('#register-link').click(function() {
        window.location.href = 'register.html';
    });

    // Xử lý chuyển hướng đến trang quên mật khẩu
    $('#forgot-password-link').click(function() {
        window.location.href = 'forgot-password.html';
    });

    // Xử lý form đăng ký
    $('#register-form').submit(function(event) {
        event.preventDefault();
        // Thêm xử lý đăng ký tại đây
        // Ví dụ: kiểm tra thông tin đăng ký, gửi thông tin đến máy chủ, ...
        alert('Đăng ký thành công!'); // Thông báo tạm thời
    });

    // Xử lý chuyển hướng đến trang đăng nhập
    $('#login-link').click(function() {
        window.location.href = 'login.html';
    });
});
