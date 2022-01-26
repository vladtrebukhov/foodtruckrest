import "jasmine";

import { FoodTruckService } from "../src/services/FoodTruckService";
import { FoodTruck } from "../src/interfaces/FoodTruck";
import { StatusCodes } from "../src/enums/StatusCodes";

describe('FoodTruckService Class Tests', () => {
    let foodTruckService: FoodTruckService;
    let foodTrucksByBlockMap: Map<String, FoodTruck[]>;
    let foodTrucksByIdMap: Map<String, FoodTruck>;
    let listOfFoodTrucks: FoodTruck[];

    beforeEach(() => {
        foodTruckService = new FoodTruckService();
        // @ts-ignore
        listOfFoodTrucks = [{"objectid": "1", "block": "5"}, {"objectid": "2", "block": "5"}];
        foodTrucksByBlockMap = new Map().set("5", listOfFoodTrucks);
        foodTrucksByIdMap = new Map().set("1", listOfFoodTrucks[0]).set("2", listOfFoodTrucks[1]);
    });

    describe('requestFoodTruckData', () => {
        // @ts-ignore
        const buildFilteredFoodTruckData = spyOn(foodTruckService, 'buildFilteredFoodTruckData');

        foodTruckService.requestFoodTruckData();

        expect(buildFilteredFoodTruckData).toHaveBeenCalled();
        // @ts-ignore
        expect(foodTruckService.requestFoodTruckData()).toEqual(StatusCodes.SUCCESS);
    });

    describe('buildFilteredFoodTruckData', () => {
        it('calls the methods addFoodTruckToBlocksMap and addFoodTruckToLocationMap for each food truck', () => {
            // @ts-ignore
            const addFoodTruckToBlocksMap = spyOn(foodTruckService, 'addFoodTruckToBlocksMap');
            // @ts-ignore
            const addFoodTruckToLocationMap = spyOn(foodTruckService, 'addFoodTruckToLocationMap');

            // @ts-ignore
            foodTruckService.buildFilteredFoodTruckData(listOfFoodTrucks);

            expect(addFoodTruckToBlocksMap).toHaveBeenCalled();
            expect(addFoodTruckToLocationMap).toHaveBeenCalledWith();
        });
    })

    describe("getFoodTrucksByBlock", () => {
        it('returns the FoodTruck array object from foodTrucksByBlock Map', () => {
            // @ts-ignore
            expect(foodTruckService.getFoodTrucksByBlock("5")).toEqual(listOfFoodTrucks);
        })
    });

    describe('getFoodTrucksByLocation', () => {
        it ('returns the FoodTruck object from foodTrucksById Map', () => {
            // @ts-ignore
            expect(foodTruckService.getFoodTruckByLocation("1")).toEqual(listOfFoodTrucks[0]);
        })
    });

    describe('processSearch', () => {
        it('returns an error if locationid and block id are both either missing or present', () => {
            expect(foodTruckService.processSearch("5,", "10")).toEqual(StatusCodes.FAILURE);
        })
        it('calls getFoodTruckByLocation if locationid is present', () => {
            // @ts-ignore
            expect(foodTruckService.processSearch("5", undefined)).toEqual(foodTruckService.getFoodTruckByLocation("5"));
        });

        it('calls getFoodTrucksByBlock if block is present', () => {
            // @ts-ignore
            expect(foodTruckService.processSearch(undefined, "1")).toEqual(foodTruckService.getFoodTrucksByBlock("1"));
        })
    });

    describe('addNewFoodTruck', () => {
        it('adds a new foodtruck to each Map object', () => {
            // @ts-ignore
            const addFoodTruckToLocationMap = spyOn(foodTruckService, 'addFoodTruckToLocationMap');
            // @ts-ignore
            const addFoodTruckToBlocksMap = spyOn(foodTruckService, 'addFoodTruckToBlocksMap');
            const newFoodTruck = {"objectid": "15", "block": "2"};

            foodTruckService.addNewFoodTruck(newFoodTruck as FoodTruck);

            expect(addFoodTruckToLocationMap).toHaveBeenCalled();
            expect(addFoodTruckToBlocksMap).toHaveBeenCalled();
            expect(foodTruckService.addNewFoodTruck(newFoodTruck as FoodTruck)).toEqual(StatusCodes.SUCCESS);
        })
    })

    describe('addFoodTruckToBlocksMap', () => {
        it('adds a new food truck to the foodTrucksByBlocksMap', () => {
            const foodTruck = {"objectid": "20", "block": "5"};

            // @ts-ignore
            foodTruckService.addFoodTruckToBlocksMap("5", foodTruck);

            // @ts-ignore
            expect(foodTrucksByBlockMap.get("5")).toEqual([...listOfFoodTrucks, foodTruck]);
        });
    })

    describe('addFoodTruckToLocationMap', () => {
        it('adds a new food truck to the foodTrucksByIdMap', () => {
            const foodTruck = {"objectid": "20", "block": "5"};

            // @ts-ignore
            foodTruckService.addFoodTruckToLocationMap("20", foodTruck);

            // @ts-ignore
            expect(foodTrucksByIdMap.get("20")).toEqual(foodTruck);
        })
    })
})