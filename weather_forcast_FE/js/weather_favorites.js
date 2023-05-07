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
    var indexHeader = document.createElement('th');
    indexHeader.textContent = 'STT';
    headerRow.appendChild(indexHeader);

    var weatherTypeHeader = document.createElement('th');
    weatherTypeHeader.textContent = 'Loại thời tiết';
    headerRow.appendChild(weatherTypeHeader);
    var regionHeader = document.createElement('th');
    regionHeader.textContent = 'Vùng';
    headerRow.appendChild(regionHeader);
    favoritesTable.appendChild(headerRow);
    var editHeader = document.createElement('th');
    editHeader.textContent = 'Chỉnh sửa';
    headerRow.appendChild(editHeader);
    var deleteHeader = document.createElement('th');
    deleteHeader.textContent = 'Xoá';
    headerRow.appendChild(deleteHeader);
    var markMapHeader = document.createElement('th');
    markMapHeader.textContent = 'Đánh dấu map';
    headerRow.appendChild(markMapHeader);
    favoritesTable.appendChild(headerRow);

    favorites.forEach(function (fav, index) {
        var dataRow = document.createElement('tr');

        var indexCell = document.createElement('td');
        indexCell.textContent = index + 1;
        dataRow.appendChild(indexCell);

        var weatherTypeCell = document.createElement('td');
        weatherTypeCell.textContent = fav.weather_type;
        dataRow.appendChild(weatherTypeCell);

        var regionCell = document.createElement('td');
        regionCell.textContent = fav.region;
        dataRow.appendChild(regionCell);

        var editCell = document.createElement('td');
        var editIcon = document.createElement('i');
        editIcon.className = 'fa fa-pencil edit-icon';
        editIcon.addEventListener('click', function () {
            alert('Chức năng này đang phát triển!');
        });
        editCell.appendChild(editIcon);
        dataRow.appendChild(editCell);

        var deleteCell = document.createElement('td');
        var deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa fa-trash delete-icon';
        deleteIcon.addEventListener('click', function () {
            alert('Chức năng này đang phát triển!');
        });
        deleteCell.appendChild(deleteIcon);
        dataRow.appendChild(deleteCell);

        var markMapCell = document.createElement('td');
        var markMapIcon = document.createElement('i');
        markMapIcon.className = 'fa fa-map-marker mark-map-icon';
        markMapIcon.addEventListener('click', function () {
            alert('Chức năng này đang phát triển!');
        });
        markMapCell.appendChild(markMapIcon);
        dataRow.appendChild(markMapCell);

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