var map, rainLayer, windLayer, tempLayer, cloudsLayer, airLayer;
var api_key = 'c9c8e558cd1dad0583f2600da8c72b7e';
var currentLocationMarker, clickedLocationMarker;

function initMap() {
    map = L.map('map', { zoomControl: false }).setView([10.762622, 106.660172], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    map.on('click', onMapClick);

    addLayerToggle("rain", rainLayer);
    addLayerToggle("wind", windLayer);
    addLayerToggle("temp", tempLayer);
    addLayerToggle("clouds", cloudsLayer);
    addLayerToggle("air", airLayer);
    // addLayerToggle("humidity", humidityLayer);

    getUserLocation();
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                setUserLocation(position.coords.latitude, position.coords.longitude);
            },
            function (error) {
                console.error('Error getting user location:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}


function addLayerToggle(id, layer) {
    document.getElementById(id).addEventListener("click", function () {
        toggleLayer(layer);
    });
}

function toggleLayer(layer) {
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    } else {
        layer.addTo(map);
    }
}

function createTileLayer(urlTemplate) {
    return L.tileLayer(urlTemplate, {
        opacity: 1.0,
    });
}

function setUserLocation(lat, lon) {
    map.setView([lat, lon], 13);
    if (currentLocationMarker) {
        map.removeLayer(currentLocationMarker);
    }
    currentLocationMarker = L.marker([lat, lon], { icon: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', iconSize: [25, 41], iconAnchor: [12, 41] }) }).addTo(map);

    currentLocationMarker.on('click', function () {
        showCurrentLocationPopup(lat, lon);
    });
}

function showCurrentLocationPopup(lat, lon) {
    var popupContent = `<div><h3>Bạn đang ở đây!</h3><p>Vĩ độ: ${lat}</p><p>Kinh độ: ${lon}</p></div>`;

    L.popup()
        .setLatLng([lat, lon])
        .setContent(popupContent)
        .openOn(map);
}

function onMapClick(e) {
    var lat = e.latlng.lat;
    var lon = e.latlng.lng;


    if (clickedLocationMarker) {
        map.removeLayer(clickedLocationMarker);
    }
    clickedLocationMarker = L.marker([lat, lon], { icon: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41], iconAnchor: [12, 41] }) }).addTo(map);

    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var wind_speed = data.wind && data.wind.speed ? data.wind.speed + " m/s" : "N/A";
            var rain_1h = data.rain && data.rain['1h'] ? data.rain['1h'] + " mm" : "N/A";
            var temperature = data.main && data.main.temp ? data.main.temp + " °C" : "N/A";
            var clouds = data.clouds && data.clouds.all ? data.clouds.all + " %" : "N/A";
            var air_pressure = data.main && data.main.pressure ? data.main.pressure + " hPa" : "N/A";
            var humidity = data.main && data.main.humidity ? data.main.humidity + " %" : "N/A";

            var popupContent = `
          <div>
            <h3>Thời tiết tại ${data.name}</h3>
            <p>Tốc độ gió: ${wind_speed}</p>
            <p>Lượng mưa 1h: ${rain_1h}</p>
            <p>Nhiệt độ: ${temperature}</p>
            <p>Mây che phủ: ${clouds}</p>
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

document.addEventListener("DOMContentLoaded", function () {
    initMap();
});

function setupShareModal() {
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
}

setupShareModal();

// Initialize layers with the appropriate URLs
rainLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${api_key}`);
windLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${api_key}`);
tempLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${api_key}`);
cloudsLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${api_key}`);
airLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${api_key}`);
// humiditylayer cần dùng phải trả phí

