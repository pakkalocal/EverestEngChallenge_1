const utils = require('../src/utils');
const { Package, Offer, Shipment, Settings, Vehicle } = require('../src/entity')

test('format decimal places to 2 digits', () => {

    let number = 2.8947598464985

    expect(utils.toFixed(number,2)).toBe(2.89);
});

// test('Get all shipments combinations', () => {

//     let packages = [
//         new Package('PKG1', 50, 30, 'OFR001'),
//         new Package('PKG2', 75, 125, 'OFR008'),
//         new Package('PKG3', 175, 100, 'OFR003'),
//         new Package('PKG4', 110, 60, 'OFR002'),
//         new Package('PKG5', 155, 95, 'NA')
//     ]

//     expect(utils.prioritizeShipments(packages, 200)).toBe([
//         [{id: 'PKG2',weight: 75,distance: 125,offer: 'OFR008',picked: undefined,estimatedTime: undefined,total_delivery_cost: undefined},
//         {id: 'PKG4',weight: 110,distance: 60,offer: 'OFR002',picked: undefined,estimatedTime: undefined,total_delivery_cost: undefined}], 
        
//         [{id: 'PKG3',weight: 175,distance: 100,offer: 'OFR003',picked: undefined,estimatedTime: undefined,total_delivery_cost: undefined}],
//         [{id: 'PKG5',weight: 155,distance: 95,offer: 'NA',picked: undefined,estimatedTime: undefined,total_delivery_cost: undefined}],
//         [{id: 'PKG1',weight: 50,distance: 30,offer: 'OFR001',picked: undefined,estimatedTime: undefined,total_delivery_cost: undefined}]
//     ]);
// });
