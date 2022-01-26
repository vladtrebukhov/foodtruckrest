/*
* API Gateway with requests coming from client
*/

import { FoodTruckService } from "./services/FoodTruckService";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const foodTruckService = new FoodTruckService();

//Boilerplate for bodyparser to parse incoming POST request body object
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Start webserver on given port
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});

// Below are server endpoints that route the request to the proper service methods in the FoodTruckService which handle the request.
// Request: request object from client
// Response: response object from web server
app.get("/", (request: any, response: any) => {
    foodTruckService.requestFoodTruckData().then(serviceResponse => response.send(serviceResponse));
});

//Assuming URL parameters from client are valid in the form of either /search?locationid=1234 or /search?block=1234
app.get('/search', (request: any, response: any) => {
    const { locationid, block } = request.query;

    response.send(foodTruckService.processSearch(locationid, block));
});

//Assuming post request will have the properties from the FoodTruck interface
app.post('/add', (request: any, response: any) => {
    const foodTruck = request.body;

    response.send(foodTruckService.addNewFoodTruck(foodTruck));
});

