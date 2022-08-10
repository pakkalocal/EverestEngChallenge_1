module.exports = {
    
    getKeyByValue: (object, value) => {
        let key = Object.keys(object).find(key => object[key] === value);
        delete object[key]
        return key;
    },
    toFixed: (num, fixed) => {
        return Math.trunc(num*Math.pow(10, fixed))/Math.pow(10, fixed)
    },
    prioritizeShipments: (packages, subsets) => {

        // let subsets = [ [ 75, 110 ], [ 175 ], [ 155 ], [ 50 ] ]
        subsets.forEach((item, index) => {
            item.forEach((j, k) => {
                // now update this j with an object
                let p = packages.find(o => o.weight === j);
                subsets[index][k] = p;
            })
        })
        
        let shipments = subsets
        return shipments;
    },
    // find max sum subset of a given array
    findBestSubset:  (array, sum) => {
        function add(a, b) { return a + b; }

        function fork(i, t) {
            var r = (result[0] || []).reduce(add, 0),
                s = t.reduce(add, 0);
            if (i === array.length || s > sum) {
                if (s <= sum && t.length && r <= s) {
                    if (r < s) {
                        result = [];
                    }
                    result.push(t);
                }
                return;
            }
            fork(i + 1, t.concat([array[i]]));
            fork(i + 1, t);
        }

        var result = [];
        fork(0, []);
        return result;
    },
    findAllSubsets: (arr, sum) => {
        
        let r = []
        let i = 0
        while(arr.length > 0){
            let result = module.exports.findBestSubset(arr, sum)
            // console.log(result[0])
            r.push(result[0])
            // console.log(r[i])
            arr = arr.filter( function( el ) {
                return r[i].indexOf( el ) < 0;
            });
            // console.log(arr)
            i += 1

        }
        return r;
    },
    applyOffer: (pack, offer) => {

        let delivery_cost = pack.deliveryCost
        let discount = 0

        if(typeof(offer) === 'string'){
            return discount
        }
   
        let min_dist = offer.min_dist
        let max_dist = offer.max_dist
        let min_weight = offer.min_weight
        let max_weight = offer.max_weight

        if((min_dist <= pack.distance && pack.distance <= max_dist) && (min_weight <= pack.weight && pack.weight <= max_weight)){
            
            discount = delivery_cost*(offer.discount_in_percent/100)
        }
        return discount;
    },
    getDeliveryCost: (base_delivery_cost, pack) => {

        let delivery_cost = base_delivery_cost + (pack.weight*10) + (pack.distance*5)
        return delivery_cost;
    },
    getTotalDeliveryCost: (delivery_cost, discount) => {
        return module.exports.toFixed((delivery_cost - discount), 2);
    },
    fetchOffer: (offers, offerCode) => {

        let offer = offers.find(offer => {
            return offer.code === offerCode
        })
        return offer;
    },
    findEstimationTime: (distance, max_speed) => {
        return module.exports.toFixed((distance/max_speed), 2);
    },
    getFirstAvailableVehicle: (vehicles) => {

        let min = (a,f)=> a.reduce((m,x)=> m[f]<x[f] ? m:x);
        let vehicle = min(vehicles, 'nextAvailableTime')
        return vehicle;
    },
    findMaxTimePackage: (packages) => {

        let max = Math.max.apply(Math, packages.map(function(pack) {
            return pack.estimatedTime; 
        }));
        return max;
    },
    deliverPackages: (shipment, vehicle, config) => {

        shipment.vehicle_id = vehicle.id
        vehicle.available = false

        let current_time = vehicle.nextAvailableTime;
        shipment.package_subset.forEach(pack => {
            // calculate estimated time
            let estimated_time = current_time + module.exports.findEstimationTime(pack.distance, config.max_speed) 
            pack.estimatedTime = module.exports.toFixed(estimated_time, 2)
        })
        //now find shipemnt subset max hrs and update in shipment currenttime
        current_time = 2 * module.exports.findMaxTimePackage(shipment.package_subset)
        current_time = module.exports.toFixed(current_time, 2)
        vehicle.nextAvailableTime = current_time
        vehicle.carriableWeight = config.max_load

    },
    //log output
    logOutput: (rl, packages) => {

        packages.forEach(pack => {
            let str = `${pack.id} ${pack.discount} ${pack.total_delivery_cost} ${pack.estimatedTime}`
            rl.write(str)
            rl.write('\n')
        })
    }
}
