const { Vehicle, Package, Offer, Shipment, Settings } = require('../src/entity');

test('creates a package object', () => {
    expect(new Package('PKG1', 15, 5, 'OFR002')).toEqual({
        id: 'PKG1',
        weight: 15,
        distance: 5,
        offer: 'OFR002',
        picked: false,
        estimatedTime: undefined,
        total_delivery_cost: undefined,
        discount: 0,
        deliveryCost: undefined
    });
});

test('creates a offer object', () => {
    expect(new Offer('OFR001', 10, '<200', '70-200')).toEqual({
        code: 'OFR001',
        discount_in_percent: 10,
        distance_expr: '<200',
        weight_expr: '70-200',
        min_dist: 0,
        max_dist: 200,
        min_weight: 70,
        max_weight: 200
    });
});

test('creates a vehicle object', () => {
  expect(new Vehicle(1, 70, true, 34.35, 200)).toEqual({
    id: 1,
    speed: 70,
    available: true,
    nextAvailableTime: 34.35,
    carriableWeight: 200
  });
});

test('creates a Setting object', () => {

  expect(new Settings(100, 5)).toEqual({
    base_delivery_cost: 100,
    no_of_packages: 5,
    no_of_vehicles: undefined,
    max_speed: undefined,
    max_load: undefined
  });

});

test('creates a Shipment object', () => {

  let packages = [
    new Package('PKG2', 75, 125, 'OFR008'),
    new Package('PKG4', 110, 60, 'OFR002')
  ]

  expect(new Shipment(1, packages, 0)).toEqual({
    priority: 1,
    package_subset: [
      {
          id: 'PKG2',
          weight: 75,
          distance: 125,
          offer: 'OFR008',
          picked: false,
          estimatedTime: undefined,
          total_delivery_cost: undefined,
          discount: 0,
          deliveryCost: undefined
      },
      {
          id: 'PKG4',
          weight: 110,
          distance: 60,
          offer: 'OFR002',
          picked: false,
          estimatedTime: undefined,
          total_delivery_cost: undefined,
          discount: 0,
          deliveryCost: undefined
      }
    ],
    vehicle_id: undefined,
    current_time: 0
  });
});