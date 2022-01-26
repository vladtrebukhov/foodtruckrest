/*
* Service layer logic for getting and setting Food Truck data
*/

import { FoodTruck } from "../interfaces/FoodTruck";
import { StatusCodes } from "../enums/StatusCodes";

const fetch = require('node-fetch');

export class FoodTruckService {
    private foodTrucksByBlock: Map<String, FoodTruck[]> = new Map();
    private foodTrucksById: Map<String, FoodTruck> = new Map();

    constructor() {}

    public requestFoodTruckData = async () => {
        // Initial API call to retrieve SF food truck data
        try {
            const response = await fetch('https://data.sfgov.org/resource/rqzj-sfat.json');
            const foodTrucks = await response.json();
            this.buildFilteredFoodTruckData(foodTrucks);
            return StatusCodes.SUCCESS;
        } catch(err) {
            return err;
        }
    }

    //Processes raw food truck data into Maps' filtered by block and locationid
    //Build a Map for each cities' (in this case only 1 city) food truck data for fast O(1) retrieval from Map when searching
    public buildFilteredFoodTruckData = (foodTrucks: FoodTruck[]): void => {
        foodTrucks.forEach(foodTruck => {
            const { block, objectid } = foodTruck;
            this.addFoodTruckToBlocksMap(block, foodTruck);
            this.addFoodTruckToLocationMap(objectid, foodTruck);
        });
    }

    //No error handling/response other than the successful object if block is not found, so undefined is a possible return value
    public getFoodTrucksByBlock(blockId: string): FoodTruck[] | undefined {
        return this.foodTrucksByBlock.get(blockId);
    }
    //Same as above
    public getFoodTruckByLocation(objectid: string): FoodTruck | undefined {
        return this.foodTrucksById.get(objectid);
    }

    //If locationid and block id are both either missing or present, return failure code
    //If just locationid is present, return object from location Map
    //If just block is present, return object from block Map
    public processSearch = (locationid: string | undefined, block: string | undefined): FoodTruck[] | FoodTruck | string | undefined => {
        if (locationid && block || locationid === undefined && block === undefined) {
            return StatusCodes.FAILURE;
        }

        if (locationid !== undefined) {
            return this.getFoodTruckByLocation(locationid);
        }

        if (block !== undefined) {
            return this.getFoodTrucksByBlock(block);
        }
    }

    //Passing a food truck object with an objectid and block will add the food truck to the in-memory Maps
    //This could also be used within the method buildFilteredTruckData,
    //but I opted for less dependency between building the Maps' initially and adding a new Food Truck
    public addNewFoodTruck(foodTruck: FoodTruck): string {
        const { block, objectid } = foodTruck;

        if (objectid === undefined || block === undefined) return StatusCodes.FAILURE;

        this.addFoodTruckToLocationMap(objectid, foodTruck);
        this.addFoodTruckToBlocksMap(block, foodTruck);
        return StatusCodes.SUCCESS;
    }

    //Reusable method to add a food truck by block. Used initially to build Map
    private addFoodTruckToBlocksMap(block: string, foodTruck: FoodTruck): void {
        if (!(this.foodTrucksByBlock.has(block))) {
            this.foodTrucksByBlock.set(block, [foodTruck]);
        } else {
            const updatedFoodTruckList: FoodTruck[] = [...this.foodTrucksByBlock.get(block) || [], foodTruck];
            this.foodTrucksByBlock.set(block, updatedFoodTruckList);
        }
    }

    //Reusable method to add food truck by objectid (locationid). Used initially to build Map
    private addFoodTruckToLocationMap(objectid: string, foodTruck: FoodTruck): void {
        this.foodTrucksById.set(objectid, foodTruck);
    }
}