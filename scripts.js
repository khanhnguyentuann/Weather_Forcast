var map;

function initMap() {
    map = L.map('map', {
        zoomControl: false // Tắt nút phóng to/thu nhỏ mặc định
    }).setView([10.762622, 106.660172], 13); // Tọa độ trung tâm của Thành phố Hồ Chí Minh và mức phóng đại 13

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Tạo nút phóng to/thu nhỏ mới và đặt bên phải
    var zoomControl = L.control.zoom({
        position: 'topright'
    }).addTo(map);

    map.on('click', onMapClick);
}


document.addEventListener("DOMContentLoaded", function () {
    initMap();
});

var shareModal = document.getElementById("share-modal");
var shareIcon = document.querySelector(".share-icon");
var closeBtn = document.querySelector(".close");

shareIcon.addEventListener("click", function () {
    shareModal.style.display = "block";
});

closeBtn.addEventListener("click", function () {
    shareModal.style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == shareModal) {
        shareModal.style.display = "none";
    }
});

function onMapClick(e) {
    // Thay 'your_api_key' bằng API key của bạn từ OpenWeatherMap
    var api_key = 'fed32be58df3a0bd09ff4c02c0da7443';
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;

    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

    // Gửi yêu cầu lấy dữ liệu thời tiết từ OpenWeatherMap
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var temperature = data.main.temp;
            var humidity = data.main.humidity;
            var wind_speed = data.wind.speed;

            // Hiển thị thông tin thời tiết trong một cửa sổ bật lên trên bản đồ
            var popupContent = `
          <div>
            <h3>Thời tiết:</h3>
            <p>Nhiệt độ: ${temperature} °C</p>
            <p>Độ ẩm: ${humidity}%</p>
            <p>Tốc độ gió: ${wind_speed} m/s</p>
          </div>
        `;
            L.popup()
                .setLatLng(e.latlng)
                .setContent(popupContent)
                .openOn(map);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
