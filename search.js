$(document).ready(function () {
    const apiKey = "c9c8e558cd1dad0583f2600da8c72b7e"; // Thay thế bằng API Key của bạn từ OpenWeatherMap

    // Hàm thực hiện tìm kiếm và trả về danh sách đề cử
    function searchLocation(query) {
        return $.ajax({
            url: `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`,
            dataType: "json",
        });
    }

    // Hàm điều hướng đến địa điểm trên bản đồ
    function navigateToLocation(item) {
        const coordinates = [item.lat, item.lon];
        map.setView(coordinates, 13); // Thay đổi vị trí bản đồ và zoom level
    
        // Nếu marker đã tồn tại, hãy xóa marker cũ trước khi thêm marker mới
        if (clickedLocationMarker) {
            map.removeLayer(clickedLocationMarker);
        }
    
        // Thêm marker màu đỏ vào vị trí được chọn
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
