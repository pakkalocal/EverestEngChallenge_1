var readline = require('readline');
process.stdin.setEncoding('utf8');

const entity = require('./entity');
const utils = require('./utils')
const Queue = require('./queue')

let Config = entity.Settings
let Offer = entity.Offer
let Package = entity.Package
let Vehicle = entity.Vehicle
let Shipment = entity.Shipment

let config;
let packages = []
let vehicles = []
let lines = 0

const offers = [
    new Offer('OFR001', 10, '<200', '70-200'),
    new Offer('OFR002', 7, '50-150', '100-250'),
    new Offer('OFR003', 5, '50-250', '10-150')
]

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

        config = new Config(parseInt(arr[0]), parseInt(arr[1]))

    }else if(arr.length == 4){

        try{
            let id = arr[0]
            let weight = parseFloat(arr[1])
            let distance = parseFloat(arr[2])
            let offer = utils.fetchOffer(offers, arr[3]) ? utils.fetchOffer(offers, arr[3]) : 'not applicable'

            let package = new Package(id, weight, distance, offer)
            let delivery_cost = utils.getDeliveryCost(config.base_delivery_cost, package)
            package.updateDeliveryCost(delivery_cost)
            let discount = utils.applyOffer(package, offer)
            discount = utils.toFixed(discount, 2);
            package.updateDiscount(discount)
            let total_delivery_cost = utils.getTotalDeliveryCost(delivery_cost, discount)
            package.updateTotalDeliveryCost(total_delivery_cost)

            packages.push(package)

        }catch(e){
            throw new Error("Invalid package input!");
        }
     
    }else if(arr.length == 3 && lines === config.no_of_packages+2){

        config.no_of_vehicles = parseInt(arr[0])
        config.max_speed = parseFloat(arr[1])
        config.max_load = parseFloat(arr[2])

        for(let i=1;i <= config.no_of_vehicles;i++){
            let id = String('VE'+i)
            let vehicle = new Vehicle(id, config.max_speed, true, 0, config.max_load)
            vehicles.push(vehicle)
        }

    }else{
      rl.close();
    }
}).on('close', () => {

    let weights = packages.map(a => a.weight);
    let subsets = utils.findAllSubsets(weights, 200)
    let shipments = utils.prioritizeShipments(packages, subsets)
   
    let queue = new Queue()
    for(let i=0;i< shipments.length;i++){
        let shipment = new Shipment(i+1, shipments[i], 0)
        queue.enqueue(shipment)
    }

    while(!queue.isEmpty()){

        let shipment = queue.dequeue()
        let availableVehicle = utils.getFirstAvailableVehicle(vehicles); 
        utils.deliverPackages(shipment, availableVehicle, config)

    }

    utils.logOutput(rl, packages)
    process.exit(0);

});