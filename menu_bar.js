$(document).ready(function () {
    const apiKey = "c9c8e558cd1dad0583f2600da8c72b7e";

    function searchLocation(query) {
        return $.ajax({
            url: `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`,
            dataType: "json",
        });
    }

    function navigateToLocation(item) {
        const coordinates = [item.lat, item.lon];
        map.setView(coordinates, 13);

        if (clickedLocationMarker) {
            map.removeLayer(clickedLocationMarker);
        }

        clickedLocationMarker = L.marker(coordinates, { icon: L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41], iconAnchor: [12, 41] }) }).addTo(map);
    }

    $("#location-search").autocomplete({
        source: function (request, response) {
            searchLocation(request.term).done(function (data) {
                response($.map(data, function (item) {
                    return {
                        label: `${item.name}, ${item.country}`,
                        value: item.name,
                        locationData: item,
                    };
                }));
            });
        },
        minLength: 2,
        select: function (event, ui) {
            navigateToLocation(ui.item.locationData);
        },
    });

    $("#location-search").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            searchLocation($("#location-search").val()).done(function (data) {
                if (data.length > 0) {
                    navigateToLocation(data[0]);
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const currentUserEl = document.getElementById('current-user');
    const logoutBtn = document.getElementById('logout-btn');
    const menuIcon = document.querySelector('.menu-icon');
    const dropdown = document.getElementById('myDropdown');
    const setupFavorites = document.getElementById('setup-favorites');
    const favoritesModal = document.getElementById('favorites-modal');
    const favoritesModalClose = document.getElementById('favorites-modal-close');
    const saveFavorites = document.getElementById('save-favorites');
    const shareModal = document.getElementById('share-modal');
    const shareModalClose = shareModal.querySelector('.close');

    function logout() {
        sessionStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    }

    function closeShareModal() {
        shareModal.style.display = 'none';
    }

    function toggleDropdown() {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }

    function showFavoritesSetupModal() {
        favoritesModal.style.display = 'block';
    }

    function closeFavoritesSetupModal() {
        favoritesModal.style.display = 'none';
    }

    function saveFavoriteSettings() {
        const weatherType = document.getElementById('weather-type').value;
        const region = document.getElementById('region').value;

        sessionStorage.setItem('favoriteWeatherType', weatherType);
        sessionStorage.setItem('favoriteRegion', region);

        favoritesModal.style.display = 'none';
    }

    if (sessionStorage.getItem('loggedIn') === 'true') {
        currentUserEl.textContent = sessionStorage.getItem('username');
    }

    logoutBtn.addEventListener('click', logout);

    function clickHandler(event) {
        if (event.target === menuIcon) {
            toggleDropdown();
        } else if (!event.target.closest('.dropdown')) {
            dropdown.style.display = 'none';
        }
    }
    window.addEventListener('click', clickHandler);

    shareModalClose.addEventListener('click', closeShareModal);
    setupFavorites.addEventListener('click', showFavoritesSetupModal);
    favoritesModalClose.addEventListener('click', closeFavoritesSetupModal);
    saveFavorites.addEventListener('click', saveFavoriteSettings);

    updateFavorites();
});