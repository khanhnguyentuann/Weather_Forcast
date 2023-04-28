// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add a tile layer (base map) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch and display weather data on the map
function updateWeatherData() {
  // Replace this with the API endpoint for your weather data
  const apiUrl = 'https://api.example.com/weather';

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
      data.forEach(weather => {
        const marker = L.marker([weather.latitude, weather.longitude]);
        marker.bindPopup(`<strong>${weather.location}</strong><br>Temperature: ${weather.temperature}`);
        weatherMarkers.addLayer(marker);
      });

      // Add the weather markers layer group to the map
      weatherMarkers.addTo(map);
    });
}

// Initialize weather markers layer group
let weatherMarkers = L.layerGroup();

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