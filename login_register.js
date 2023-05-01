function initMap() {
    var map = L.map('map', { zoomControl: false }).setView([14.0583, 108.2772], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom: 18}).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);
}

document.addEventListener('DOMContentLoaded', initMap);

$(document).ready(function () {
    // Xử lý form đăng nhập
    $('#login-form').submit(function (event) {
        event.preventDefault();

        // Lấy giá trị từ các trường tên đăng nhập và mật khẩu
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

    // Xử lý chuyển hướng đến trang đăng ký
    $('#register-link').click(function () {
        window.location.href = 'register.html';
    });

    // Xử lý form đăng ký
    $('#register-form').submit(function (event) {
        event.preventDefault();
        alert('Đăng ký thành công!');
    });

    $('#login-link').click(function () {
        window.location.href = 'login.html';
    });
});
