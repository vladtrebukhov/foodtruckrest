export interface FoodTruck {
    address: string;
    applicant: string;
    approved: string;
    block: string;
    blocklot: string;
    cnn: string;
    expirationdate: string;
    facilitytype: string;
    fooditems: string;
    latitude: string;
    location: Location;
    locationdescription: string;
    longitude: string;
    lot: string;
    objectid: string;
    permit: string;
    priorpermit: string;
    received: string;
    schedule: string;
    status: string;
    x: string;
    y: string;
}

export interface Location {
    latitude: string;
    longitude: string;
    human_address: string;
}
