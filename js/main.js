/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: _Minjung Kang_ Student ID: _151293198_ Date: _June 11th 2021_
*
*
********************************************************************************/
let restaurantData = [];
let currentRestaurant = {};
let page = 1;
const perPage = 10;
let map = null;

function avg(grades) {
    var sum = 0;
    for(var i = 0; i < grades.length; i++) {
        sum += grades[i].score;
    }
    return sum / grades.length;
}

function loadRestaurantData() {
    
    fetch("https://ancient-savannah-65572.herokuapp.com/api/restaurants?page=" + page + "&perPage=" + perPage)
        .then(response => response.json())
        .then(data => {

            restaurantData = data;            
            $("#restaurant-table tbody").empty();

            let tableRows = _.template(`
                <% _.forEach(restaurantData, function(restaurant) { %> 
                    <tr data-id="<%- restaurant._id %>">
                    <td><%- restaurant.name %></td>
                    <td><%- restaurant.cuisine %></td>
                    <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
                    <td><%- avg(restaurant.grades) %></td></tr>
                <% }); %>
                `);

            let tableRowsResult = tableRows({restaurants: data});
            $("#restaurant-table tbody").html(tableRowsResult);
            $("#current-page").html(page);
            

        }).catch(err => console.error('Unable to load theaters data:', err));
}

$(function(){

    loadRestaurantData();

    $("#restaurant-table tbody").on("click", "tr", function() {
        for(let i =0; i < restaurantData.length; i++){
            if(restaurantData[i]._id == $(this).attr("data-id")){
                currentRestaurant = restaurantData[i];
            }    
        }
        $(".modal-title").html(currentRestaurant.name);
        $("#restaurant-address").html(currentRestaurant.address.building + " " + currentRestaurant.address.street);
        $('#restaurant-modal').modal('show');
    });

    $("#previous-page").on("click", function() {
        if(page > 1) {
            page--;
            loadRestaurantData();
        }       
    });

    $("#next-page").on("click", function() {
        page++;
        loadRestaurantData();
    });

    $('#restaurant-modal').on('shown.bs.modal', function () {
        map = new L.Map('leaflet', {
            center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
            zoom: 18,
            layers: [
            new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
           });
           L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
    });

    $('#restaurant-modal').on('hidden.bs.modal', function () {
        map.remove();
    });

});