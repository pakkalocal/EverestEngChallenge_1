const fs = require('fs')
let config = JSON.parse(fs.readFileSync('config.json'));
const utils = require('./utils')
var readline = require('readline');
process.stdin.setEncoding('utf8');

let base_delivery_cost, no_of_packages, no_of_vehicles, max_speed, max_load;
let packages = {}
let lines = 0

let weights_arr = []

let shipments = {}
let count = 1
let weight_to_package_map = {}

let output = {}
let vehicles = []

// find total delivery cost for a particular package
function findTotalDeliveryCost(pkg_id){
    let weight_in_kg = packages[pkg_id][0]
    let distance_in_km = packages[pkg_id][1]
    let offer = packages[pkg_id][2]
    let delivery_cost = base_delivery_cost + (weight_in_kg*10) + (distance_in_km*5)
    let discount = 0
    if(offer && config['offers'][offer]){
        
        let min_dist = config.offers[offer]['distance']['min']
        let max_dist = config.offers[offer]['distance']['max']
        let min_weight = config.offers[offer]['weight']['min']
        let max_weight = config.offers[offer]['weight']['max']

        if((min_dist <= distance_in_km && distance_in_km <= max_dist) && (min_weight <= weight_in_kg && weight_in_kg <= max_weight)){
            // console.log(min_dist+' <= '+distance_in_km+' <= '+max_dist)
            // console.log(min_weight+' <= '+weight_in_kg+' <= '+max_weight)
            discount = delivery_cost*(config['offers'][offer]['discount']/100)
        }
    }else{
        // console.log('offer not found or not applicable!')
    }
    let total_delivery_cost = delivery_cost - discount
    return [parseFloat(discount.toFixed(2)), parseFloat(total_delivery_cost.toFixed(2))]
}

// find all subsets of a given array using recursion
function recur(arr, sum){
    if(arr.length > 0){
        let result = utils.getCombinations(arr, sum)[0]
        // console.log(result)
        let r = []
        for(i in result){
            let pkg_id = utils.getKeyByValue(weight_to_package_map, result[i])
            r.push(pkg_id)
        }
        shipments[count] = r
        const filteredArray = arr.filter(function(x) { 
            return result.indexOf(x) < 0;
        });
        count++
        recur(filteredArray, sum)
    }
}

//find delivery estimatiom time for all packages
function findDeliveryEstimationTime(shipments){

    for(i in shipments) {
        // console.log(vehicles)
        if(shipments[i].length > 1){
            //single shipment and multiple packages
            vehicles.sort(function(a, b){return a-b});
            let offset = vehicles[0] || 0
            // console.log('offset : '+offset)
            let shipment_time = 0
            let longest = 0
           for(j in shipments[i]){
               let id = shipments[i][j]
               let distance = packages[id][1]
               let ptime = offset + utils.toFixed((distance/max_speed),2)
               
            //    console.log('ptime - '+ptime)
            //    console.log('distance : '+ distance)
               
            //    output[id] = [ptime] 
               output[id].push(parseFloat(ptime.toFixed(2)))
                if(distance > longest){
                    // console.log('true')
                    longest = distance
                    shipment_time = utils.toFixed((distance/max_speed)*2,2)
                    // console.log('shipment_time : '+shipment_time)
                }
           } 
           var total_time = offset + shipment_time
        //    console.log('total_time : '+total_time)
            if(vehicles.length === no_of_vehicles){
                vehicles[0] = total_time
            }else{
                vehicles.push(total_time)
                // console.log('vehicles1 : '+vehicles)
            }
    
        }else{
            // single shipment and single package 
            let id = shipments[i][0]
            let distance = packages[id][1]
            vehicles.sort(function(a, b){return a-b});
            
            if(vehicles.length === no_of_vehicles){
                let offset = vehicles[0] 
                // console.log('offset : '+offset)
                let ptime = offset + utils.toFixed((distance/max_speed),2)
                // todo, add ptime to the output results
                // output[id] = [ptime]
                output[id].push(parseFloat(ptime.toFixed(2)))
                let total_time = offset + (utils.toFixed((distance/max_speed)*2,2))
                vehicles[0] = total_time
            }else{
                let offset = 0
                // console.log('offset : '+offset)
                let ptime = offset + utils.toFixed((distance/max_speed),2)
                // todo, add ptime to the output results
                // output[id] = [ptime]
                output[id].push(parseFloat(ptime.toFixed(2)))
                let total_time = offset + (utils.toFixed((distance/max_speed)*2,2))
                vehicles.push(utils.toFixed(total_time,2 ))
                // console.log('vehicles2 : '+vehicles)
            }
        }
    }
    
}


//log output
function logOutput(rl, output){
    for(let key in output){
        let str = `${key} ${output[key][0]} ${output[key][1]} ${output[key][2]}`
        rl.write(str)
        rl.write('\n')
    }
}

// Input from user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

let cmdlInput = []

rl.on('line', (line) => {

    line !== '' ? cmdlInput.push(line): rl.close();
    line = line.toString()
    let arr = line.split(' ')
    lines += 1;
    if(arr.length == 2){
      base_delivery_cost = parseInt(arr[0])
      no_of_packages = parseInt(arr[1])
    //   console.log('base_delivery_cost : '+base_delivery_cost+' no_of_packages : '+no_of_packages)
    }else if(arr.length == 4){
  
      packages[arr[0]] = [parseFloat(arr[1]), parseFloat(arr[2]), arr[3]]
      weight_to_package_map[arr[0]] = parseFloat(arr[1])
      weights_arr.push(parseFloat(arr[1]))
     
    }else if(arr.length == 3 && lines === no_of_packages+2){
      no_of_vehicles = parseInt(arr[0])
      max_speed = parseFloat(arr[1])
      max_load = parseFloat(arr[2])
    //   console.log('no_of_vehicles : '+no_of_vehicles+' max_speed : '+max_speed+' max_load : '+max_load)
    }else{
      rl.close();
    }
  }).on('close', () => {
    //call delivery cost estimation function 
    // console.log('packages : '+JSON.stringify(packages))
    for(let i in packages){
      const dcost = findTotalDeliveryCost(i)
      output[i] = dcost
    //   console.log(dcost)
    }
    // console.log('weights_arr : '+weights_arr)
    // console.log('weight_to_package_map : '+JSON.stringify(weight_to_package_map))
    // make shipments and set their priorities
    recur(weights_arr, max_load)
    // console.log(shipments)
  
    //call delivery time estimator
    findDeliveryEstimationTime(shipments)
    // console.log(output)
    //log output
    logOutput(rl, output)
    process.exit(0);
  });