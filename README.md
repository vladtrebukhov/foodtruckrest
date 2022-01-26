**FOOD TRUCK REST SERVICE**

*Requirements*
1. Node is required in order to run the application

*Set up*:
1. Run `npm install` to install the `node_modules` directory which contains the dependencies used for development.
2. Since the service uses Typescript, compile with the command `tsc` in the parent directory. This will create a `dist` folder that will contain the compiled JS code running the application.
3. To run, from the parent directory, execute `npm start`. This is an alias for `node .dist/api_gateway.js`. You should see a message saying `Server running on port 4000`.
4. The urls to test on localhost are `/`, `/search/?locationid=value`, `search/?block=value` and `/add`. The first request that should be made is to the `/` route to populate the data structures built for the solution. I suggest using the free Chrome extension `Talend API Tester` to easily test the requests.
5. For testing, simply run `npm test`. All tests fail due to configuration I could not figure out due to time constraints :(
****

*The problem and solution*:

Given a list of food truck objects in a city, write a service to retrieve food trucks by the location id and block properties, as well as be able to add a new food truck to the list. The solution must be flexible to take into account if many cities given, not just one.

***Assumptions Made***:
1. Data returned from API/initial dataset is clean; no duplicate `objectid's` exist.

I approached this problem with the intent to optimize for search queries made from the client. In order to minimize time complexity, I opted to use a Map object to store each of the requested data sets. 
This way, whenever a search query for a specific `block` or `locationid` is made, the data can be retrieved in `O(1)` time. Whenever a new food truck is added, it is also added to these Map objects , once again for future easy and fast retrieval.
I believe this solution can be scaled well with many cities and millions of entries because we can simply specify which city to search, then access its Map objects to get the data. This however would require the preprocessing load to build two Maps for each city after the initial data retrieval. 

The tradeoff here is made with the space complexity; we must store two Map objects for each city, using more space than a solution which avoids preprocessing of data and simply calculates the proper response on search query. This kind of solution would save space, but would take much longer.

Estimation For Large Dataset:

25kb/entry * 10,000,000 Food Trucks * 100 cities * 2 Maps = ~50TB data to store

***Given more time/Done differently***:
1. Error handling/validation of inputs
2. Refactoring and adding proper responses (not undefined/empty objects)
3. Wrapper class for entry point at ApiGateway
4. I don't work in node and never used express, so learn more about these tools.
5. More robust unit testing each method. I am used to testing with Jasmine pre-configured in Angular, could not figure out proper boilerplate that is already configured with the Angular CLI. FoodTruckService methods are not recognized in the `spec` file causing tests to not run. Logic should still be sound however.
6. Unit test API gateway.

