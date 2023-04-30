let map;
let rainLayer, windLayer, tempLayer, cloudsLayer, airLayer;
const api_key = 'c9c8e558cd1dad0583f2600da8c72b7e';
let currentLocationMarker, clickedLocationMarker;

rainLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${api_key}`);
windLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${api_key}`);
tempLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${api_key}`);
cloudsLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${api_key}`);
airLayer = createTileLayer(`https://{s}.tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${api_key}`);

function addLayerToggle(id, layer) {
    document.getElementById(id).addEventListener("click", function () {
        toggleLayer(layer);
    });
}

function createTileLayer(urlTemplate) {
    return L.tileLayer(urlTemplate, {
        opacity: 1.0,
    });
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

    getUserLocation();
}

function toggleLayer(layer) {
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    } else {
        layer.addTo(map);
    }
}

async function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function showWeatherPopup(lat, lon, title, marker) {
    const data = await fetchWeatherData(lat, lon);
    if (data) {
        const wind_speed = data.wind && data.wind.speed ? data.wind.speed + " m/s" : "N/A";
        const rain_1h = data.rain && data.rain['1h'] ? data.rain['1h'] + " mm" : "N/A";
        const temperature = data.main && data.main.temp ? data.main.temp + " °C" : "N/A";
        const clouds = data.clouds && data.clouds.all ? data.clouds.all + " %" : "N/A";
        const air_pressure = data.main && data.main.pressure ? data.main.pressure + " hPa" : "N/A";
        const humidity = data.main && data.main.humidity ? data.main.humidity + " %" : "N/A";

        const popupContent = `
            <div>
                <h3>${title} ${data.name}</h3>
                <p>Vĩ độ: ${lat}</p>
                <p>Kinh độ: ${lon}</p>
                <p>Tốc độ gió: ${wind_speed}</p>
                <p>Lượng mưa 1h: ${rain_1h}</p>
                <p>Nhiệt độ: ${temperature}</p>
                <p>Mây che phủ: ${clouds}</p>
                <p>Áp suất không khí: ${air_pressure}</p>
                <p>Độ ẩm: ${humidity}</p>
            </div>
        `;

        L.popup()
            .setLatLng([lat, lon])
            .setContent(popupContent)
            .openOn(map);

        marker.on('click', function () {
            showWeatherPopup(lat, lon, title, marker);
        });
    }
}

async function setUserLocation(lat, lon) {
    map.setView([lat, lon], 13);
    if (currentLocationMarker) {
        map.removeLayer(currentLocationMarker);
    }
    currentLocationMarker = L.marker([lat, lon], { icon: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', iconSize: [25, 41], iconAnchor: [12, 41] }) }).addTo(map);

    await showWeatherPopup(lat, lon, "Bạn đang tại", currentLocationMarker);
}

async function onMapClick(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    if (clickedLocationMarker) {
        map.removeLayer(clickedLocationMarker);
    }
    clickedLocationMarker = L.marker([lat, lon], { icon: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41], iconAnchor: [12, 41] }) }).addTo(map);
    await showWeatherPopup(lat, lon, "Thời tiết tại", clickedLocationMarker);
}

document.addEventListener("DOMContentLoaded", function () {
    initMap();
});

function setupShareModal() {
    const shareModal = document.getElementById("share-modal");
    const shareIcon = document.querySelector(".share-icon");
    const closeBtn = document.querySelector(".close");
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