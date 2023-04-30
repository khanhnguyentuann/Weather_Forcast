var map;
var rainLayer;
var windLayer;
var tempLayer;
var cloudsLayer;
var waveLayer;
var airLayer;

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

    // Khởi tạo rain layer với opacity 0.5
    rainLayer = L.tileLayer('https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443', {
        opacity: 1.0
    });

    windLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443`, {
        opacity: 1.0
    });

    tempLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443`, {
        opacity: 1.0
    });

    cloudsLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443`, {
        opacity: 1.0
    });

    waveLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/sea/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443`, {
        opacity: 1.0
    });

    airLayer = L.tileLayer(`https://{s}.tile.openweathermap.org/map/air_pollution/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443`, {
        opacity: 1.0
    });

    document.getElementById("rain").addEventListener("click", function () {
        if (map.hasLayer(rainLayer)) {
            map.removeLayer(rainLayer);
        } else {
            rainLayer.addTo(map);
        }
    });

    document.getElementById("wind").addEventListener("click", function () {
        if (map.hasLayer(windLayer)) {
            map.removeLayer(windLayer);
        } else {
            windLayer.addTo(map);
        }
    });

    document.getElementById("temp").addEventListener("click", function () {
        if (map.hasLayer(tempLayer)) {
            map.removeLayer(tempLayer);
        } else {
            tempLayer.addTo(map);
        }
    });

    document.getElementById("clouds").addEventListener("click", function () {
        if (map.hasLayer(cloudsLayer)) {
            map.removeLayer(cloudsLayer);
        } else {
            cloudsLayer.addTo(map);
        }
    });

    document.getElementById("wave").addEventListener("click", function () {
        if (map.hasLayer(waveLayer)) {
            map.removeLayer(waveLayer);
        } else {
            waveLayer.addTo(map);
        }
    });

    document.getElementById("air").addEventListener("click", function () {
        if (map.hasLayer(airLayer)) {
            map.removeLayer(airLayer);
        } else {
            airLayer.addTo(map);
        }
    });
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
    var api_key = 'fed32be58df3a0bd09ff4c02c0da7443';
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;

    // Lấy thông tin thời tiết từ OpenWeatherMap
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var wind_speed = data.wind && data.wind.speed ? data.wind.speed + " m/s" : "N/A";
            var rain_1h = data.rain && data.rain['1h'] ? data.rain['1h'] + " mm" : "N/A";
            var temperature = data.main && data.main.temp ? data.main.temp + " °C" : "N/A";
            var clouds = data.clouds && data.clouds.all ? data.clouds.all + " %" : "N/A";
            var wave_height = data.waves && data.waves.height ? data.waves.height + " m" : "N/A";
            var air_pressure = data.main && data.main.pressure ? data.main.pressure + " hPa" : "N/A";
            var humidity = data.main && data.main.humidity ? data.main.humidity + " %" : "N/A";

            var popupContent = `
          <div>
            <h3>Thời tiết tại ${data.name}</h3>
            <p>Tốc độ gió: ${wind_speed}</p>
            <p>Lượng mưa: ${rain_1h}</p>
            <p>Nhiệt độ: ${temperature}</p>
            <p>Mây: ${clouds}</p>
            <p>Chiều cao sóng: ${wave_height}</p>
            <p>Áp suất không khí: ${air_pressure}</p>
            <p>Độ ẩm: ${humidity}</p>
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
