const setupFavorites = document.getElementById('setup-favorites');
const viewFavorites = document.getElementById('view-favorites');
const saveFavoritesModal = document.getElementById('save-favorites-modal');
const saveFavoritesModalClose = document.getElementById('save-favorites-modal-close');
const viewFavoritesModal = document.getElementById('view-favorites-modal');
const viewFavoritesModalClose = document.getElementById('view-favorites-modal-close');

function showFavorites(favorites) {
    var favoritesTable = document.createElement('table');
    favoritesTable.className = 'favorites-table';

    var headerRow = document.createElement('tr');
    var weatherTypeHeader = document.createElement('th');
    weatherTypeHeader.textContent = 'Loại thời tiết';
    headerRow.appendChild(weatherTypeHeader);
    var regionHeader = document.createElement('th');
    regionHeader.textContent = 'Vùng';
    headerRow.appendChild(regionHeader);
    favoritesTable.appendChild(headerRow);

    favorites.forEach(function (fav) {
        var dataRow = document.createElement('tr');
        var weatherTypeCell = document.createElement('td');
        weatherTypeCell.textContent = fav.weather_type;
        dataRow.appendChild(weatherTypeCell);
        var regionCell = document.createElement('td');
        regionCell.textContent = fav.region;
        dataRow.appendChild(regionCell);
        favoritesTable.appendChild(dataRow);
    });

    $('#favorites-table-container').empty().append(favoritesTable);
}

$(document).ready(function () {
    $('#save-favorites').click(function () {
        var weatherType = $('#weather-type').val();
        var region = $('#region').val();
        var username = sessionStorage.getItem('username');

        $.ajax({
            url: "http://localhost:5000/save-favorites",
            type: 'POST',
            data: {
                weather_type: weatherType,
                region: region,
                username: username
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                console.log(response);
                if (response === 'success') {
                    alert('Lưu thành công!');
                } else {
                    alert('Lưu thất bại!');
                }
            },
            error: function (error) {
                console.log(error);
                alert('Lỗi khi lưu ưa thích!');
            }
        });
        saveFavoritesModal.style.display = 'none';
    });

    saveFavoritesModalClose.addEventListener('click', function () {
        saveFavoritesModal.style.display = 'none';
    });

    viewFavorites.addEventListener('click', function () {
        var username = sessionStorage.getItem('username');

        $.ajax({
            url: "http://localhost:5000/get-favorites",
            type: 'POST',
            data: {
                username: username
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                if (response !== 'failure') {
                    var favorites = JSON.parse(response);
                    showFavorites(favorites);
                    viewFavoritesModal.style.display = 'block';
                } else {
                    alert('Không thể tải danh sách ưa thích!');
                }
            },
            error: function (error) {
                console.log(error);
                alert('Lỗi khi tải danh sách ưa thích!');
            }
        });
    });

    viewFavoritesModalClose.addEventListener('click', function () {
        viewFavoritesModal.style.display = 'none';
    });
});

function showSaveFavoritesModal() {
    saveFavoritesModal.style.display = 'block';
}
function closeSaveFavoritesModal() {
    saveFavoritesModal.style.display = 'none';
}

function showViewFavoritesModal() {
    viewFavoritesModal.style.display = 'block';
}

function closeViewFavoritesModal() {
    viewFavoritesModal.style.display = 'none';
}

setupFavorites.addEventListener('click', showSaveFavoritesModal);
saveFavoritesModalClose.addEventListener('click', closeSaveFavoritesModal);
viewFavoritesModalClose.addEventListener('click', closeViewFavoritesModal);