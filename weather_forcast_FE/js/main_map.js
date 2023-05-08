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

        const popupContent = `
            <div>
            <h3 style="text-align: center;
            background-color: #333;
            color: #fff;padding: 10px;
            border-radius: 12px;
            border: 2px solid blue;
            font-family: cursive;">${title} ${data.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> Vĩ độ: ${lat}</p>
                <p><i class="fas fa-map-marker-alt"></i> Kinh độ: ${lon}</p>
                <p><i class="fas fa-wind"></i> Tốc độ gió: ${wind_speed}</p>
                <p><i class="fas fa-tint"></i> Lượng mưa 1h: ${rain_1h}</p>
                <p><i class="fas fa-thermometer-half"></i> Nhiệt độ: ${temperature}</p>
                <p><i class="fas fa-cloud"></i> Mây che phủ: ${clouds}</p>
                <p><i class="fas fa-tachometer-alt"></i> Áp suất không khí: ${air_pressure}</p>
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
    await showWeatherForecast(lat, lon);

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

async function fetchWeatherForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        return null;
    }
}

async function showWeatherForecast(lat, lon) {
    const data = await fetchWeatherForecast(lat, lon);
    if (data) {
        let forecastHTML = `
            <div class='forecast-container'>
                <button class='close-button'>&times;</button>
        `;

        const currentDate = new Date();
        const currentTime = currentDate.getTime();

        // Chuyển về múi giờ Hà Nội (UTC+7)
        const timezoneOffset = 7 * 60 * 60 * 1000;
        currentDate.setTime(currentTime + timezoneOffset);

        const currentHour = currentDate.getHours();

        // gán startHour bằng 12 khi giờ hiện tại nhỏ hơn 12
        let startHour = currentHour < 12 ? 12 : 0;

        let startTimestamp = currentDate.setHours(startHour, 0, 0, 0);

        // Nếu mốc thời gian đầu tiên là 12h, thì giữ nguyên ngày hiện tại, ngược lại thì tăng lên 1 ngày
        if (startHour == 0) {
            currentDate.setDate(currentDate.getDate() + 1);
        }

        startTimestamp = currentDate.getTime();

        const endTimestamp = startTimestamp + (7 * 12 * 60 * 60 * 1000);

        let displayedForecasts = 0;
        for (let i = 0; i < data.list.length && displayedForecasts < 7; i++) {
            const forecast = data.list[i];
            const forecastDateTime = new Date(forecast.dt * 1000);
            // Chuyển về múi giờ Hà Nội (UTC+7) cho thời gian dự báo
            forecastDateTime.setTime(forecastDateTime.getTime() + timezoneOffset);
            const forecastTimestamp = forecastDateTime.getTime();

            if (forecastTimestamp < startTimestamp || forecastTimestamp > endTimestamp) {
                continue;
            }

            // Cập nhật mốc thời gian tiếp theo cách mốc hiện tại 12 tiếng
            startTimestamp += 12 * 60 * 60 * 1000;

            const date = forecastDateTime.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            const time = forecastDateTime.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            });

            const temperature = forecast.main.temp ? forecast.main.temp + " °C" : "N/A";
            const rain_3h = forecast.rain && forecast.rain['3h'] ? forecast.rain['3h'] + " mm" : "N/A";
            const wind_speed = forecast.wind.speed ? forecast.wind.speed + " m/s" : "N/A";
            const weatherIcon = forecast.weather[0].icon ? `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png` : "";
            const weatherDescription = forecast.weather[0].description ? forecast.weather[0].description.charAt(0).toUpperCase() + forecast.weather[0].description.slice(1) : "";

            const temperatureIcon = "<i class='fas fa-thermometer-half'></i>";
            const rainIcon = "<i class='fas fa-tint'></i>";
            const windIcon = "<i class='fas fa-wind'></i>";

            forecastHTML += `
                <div class='forecast-item'>
                    <h4>${data.city.name} - ${time} - ${date}</h4>
                    <span>
                        <img src="${weatherIcon}" alt="${weatherDescription}" width="50" height="50" />
                        <span>${weatherDescription}</span>
                    </span>
                    <p style="text-align: left;padding-left: 20px;">${temperatureIcon}   Nhiệt độ: ${temperature}</p>
                    <p style="text-align: left;padding-left: 20px;">${rainIcon}   Lượng mưa: ${rain_3h}</p>
                    <p style="text-align: left;padding-left: 20px;">${windIcon}   Tốc độ gió: ${wind_speed}</p>
                </div>
            `;

            displayedForecasts++;
        }

        forecastHTML += "</div>";

        const forecastElement = document.getElementById("forecast");
        forecastElement.innerHTML = forecastHTML;
        forecastElement.style.display = "block";

        // Add event listener to the close button
        const closeButton = document.querySelector('.forecast-container .close-button');
        closeButton.addEventListener('click', function () {
            forecastElement.style.display = "none";
        });
    }
}

