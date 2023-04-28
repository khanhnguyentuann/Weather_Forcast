// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Initialize tile layer variable
let tileLayer;

// Add a tile layer (base map) to the map
tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// Add event listeners for the buttons
document.getElementById('btnWind').addEventListener('click', () => updateMapLayer('wind'));
document.getElementById('btnRain').addEventListener('click', () => updateMapLayer('rain'));
document.getElementById('btnClouds').addEventListener('click', () => updateMapLayer('clouds'));
document.getElementById('btnWaves').addEventListener('click', () => updateMapLayer('waves'));
document.getElementById('btnAirPressure').addEventListener('click', () => updateMapLayer('pressure'));
document.getElementById('btnTemperature').addEventListener('click', () => updateMapLayer('temperature'));

// Function to update the map layer
function updateMapLayer(layer) {
  const layerUrl = getLayerUrl(layer);

  if (map.hasLayer(tileLayer)) {
    map.removeLayer(tileLayer);
  }

  if (layer === 'wind') {
    // Replace the tile layer with the wind layer
    tileLayer = L.tileLayer('https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443', {
      attribution: 'Map data © <a href="https://openweathermap.org">OpenWeatherMap</a>'
    });
  } else {
    // Add a tile layer (base map) to the map
    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
    });
  }

  tileLayer.addTo(map);
}

// Function to get the URL for the selected layer
function getLayerUrl(layer) {
  let layerUrl;

  switch (layer) {
    case 'wind':
      // Replace with the URL for the wind layer
      layerUrl = 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443';
      break;
    case 'rain':
      // Replace with the URL for the rain layer
      layerUrl = 'https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443';
      break;
    case 'clouds':
      // Replace with the URL for the clouds layer
      layerUrl = 'https://{s}.tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443';
      break;
    case 'waves':
      // Replace with the URL for the waves layer
      layerUrl = 'https://{s}.tile.openweathermap.org/map/waves_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443';
      break;
    case 'pressure':
      // Replace with the URL for the air pressure layer
      layerUrl = 'https://{s}.tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443';
      break;
    case 'temperature':
      // Replace with the URL for the temperature layer
      layerUrl = 'https://{s}.tile.openweathermap.org/map/tem_new/{z}/{x}/{y}.png?appid=fed32be58df3a0bd09ff4c02c0da7443';
      break;
    default:
      layerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  }
  return layerUrl;
}

// Initialize weather markers layer group
let weatherMarkers = L.layerGroup();

// Fetch and display weather data on the map
function updateWeatherData() {
  // Replace this with the API endpoint for your weather data
  // For this example, I'm using OpenWeatherMap API with a placeholder for your API key
  // Replace 'YOUR_API_KEY' with your actual API key
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=51.505&lon=-0.09&appid=fed32be58df3a0bd09ff4c02c0da7443';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Remove any existing weather markers from the map
      if (map.hasLayer(weatherMarkers)) {
        map.removeLayer(weatherMarkers);
      }
      // Create a new layer group for weather markers
      weatherMarkers = L.layerGroup();
      // Add weather markers to the map based on the fetched data
      const marker = L.marker([data.coord.lat, data.coord.lon]);
      marker.bindPopup(`<strong>${data.name}</strong><br>Temperature: ${data.main.temp}`);
      weatherMarkers.addLayer(marker);

      // Add the weather markers layer group to the map
      weatherMarkers.addTo(map);
    });
}
// Update the weather data when the page loads
updateWeatherData();

document.getElementById('timeSlider').addEventListener('input', function (event) {
  // Update the map based on the selected time
  console.log('Selected time:', event.target.value);
  // Update the weather data
  updateWeatherData();
});

document.querySelectorAll('input[name="timeUnit"]').forEach(function (radio) {
  radio.addEventListener('change', function (event) {
    // Update the map based on the selected time unit (hours or days)
    console.log('Selected time unit:', event.target.value);
    // Update the weather data
    updateWeatherData();
  });
});

document.querySelectorAll('aside button').forEach(function (button) {
  button.addEventListener('click', function (event) {
    // Update the map based on the selected weather parameter
    console.log('Selected weather parameter:', event.target.textContent);
    // Update the weather data
    updateWeatherData();
  });
});