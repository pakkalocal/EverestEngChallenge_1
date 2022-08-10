
class Package {

    id;
    weight;
    distance;
    offer;
    picked = false;
    discount = 0;
    estimatedTime;
    deliveryCost;
    total_delivery_cost;

    constructor(id, weight, distance, offer){
        this.id = id
        this.weight = weight
        this.distance = distance
        this.offer = offer
    }

    print(){
        return `${this.id} ${this.weight} ${this.distance} ${this.offer}`
    }

    isPicked() {
        return this.picked;
    }

    getEstimatedTime(){
        return this.estimatedTime;
    }

    updateDeliveryCost(deliveryCost){
        this.deliveryCost = deliveryCost
    }

    updateDiscount(discount){
        this.discount = discount
    }

    updateTotalDeliveryCost(total_delivery_cost){
        this.total_delivery_cost = total_delivery_cost
    }

    toString() {
        return "{" +
                "id='" + this.id + '\'' +
                ", weight=" + this.weight +
                ", distance=" + this.distance +
                ", offercode='" + this.offercode + '\'' +
                ", picked=" + this.picked +
                ", estimatedTime=" + this.estimatedTime +
                ", deliveryCost=" + this.total_delivery_cost +
                '}';
    }
}

class Offer {
    code;
    discount_in_percent;
    min_dist;
    max_dist;
    min_weight;
    max_weight;

    constructor(code, discount_in_percent, distance_expr, weight_expr){
        this.code = code
        this.discount_in_percent = discount_in_percent
        this.distance_expr = distance_expr
        this.weight_expr = weight_expr
        if(! this.parseDistExpr(distance_expr)){
            throw new Error("Invalid Distance expression!");
        }
        if(! this.parseWeightExpr(weight_expr)){
            throw new Error("Invalid Weight expression!");
        }
    }

    parseDistExpr(distance_expr){
        let str = distance_expr.split(/-|</)
        this.min_dist = str[0] != '' ?  parseInt(str[0].replace(/\s/g, '')) : 0 ;
        this.max_dist = str[1] != '' ?  parseInt(str[1].replace(/\s/g, '')) : 0 ;
        return true;
    }

    parseWeightExpr(weight_expr){
        let str = weight_expr.split(/-|</)
        this.min_weight = str[0] != '' ?  parseInt(str[0].replace(/\s/g, '')) : 0 ;
        this.max_weight = str[1] != '' ?  parseInt(str[1].replace(/\s/g, '')) : 0 ;
        return true;
    }

    print(){
        return `${this.code} ${this.discount_in_percent}% ${this.distance_expr} ${this.weight_expr}`
    }
}

class Vehicle {
    id;
    speed;
    available=true; //boolean
    nextAvailableTime=0; //float in hrs
    carriableWeight; // max carriable weight

    constructor(id, speed, available, nextAvailableTime, carriableWeight){
        this.id = id;
        this.speed = speed;
        this.available = available;
        this.nextAvailableTime = nextAvailableTime;
        this.carriableWeight = carriableWeight;
    }

    isAvailable(){
        return this.available;
    }

    print(){
        return `${this.id} ${this.speed} ${this.available} ${this.nextAvailableTime} ${this.carriableWeight}`
    }
}

class Settings {
    base_delivery_cost;
    no_of_packages;
    no_of_vehicles;
    max_speed;
    max_load;
    constructor(base_delivery_cost, no_of_packages){
        this.base_delivery_cost = base_delivery_cost
        this.no_of_packages = no_of_packages
    }
}

class Shipment {

    priority;
    package_subset;
    vehicle_id;
    current_time;

    constructor(priority, package_subset, current_time){
        this.priority = priority
        this.package_subset = package_subset
        this.current_time = current_time
    }
}

module.exports = {
    Package: Package,
    Vehicle: Vehicle,
    Offer: Offer,
    Settings: Settings,
    Shipment: Shipment
}