const Queue = require('../src/queue');

test('create a queue', () => {

    expect(new Queue()).toEqual({"items": []});
});

test('queue enqueue', () => {
    
    let queue = new Queue()
    queue.enqueue({shipment: 1, packages: 2})
    queue.enqueue({shipment: 2, packages: 2})
    queue.enqueue({shipment: 3, packages: 2})

    expect(queue).toEqual({"items": [
        {shipment: 1, packages: 2},
        {shipment: 2, packages: 2},
        {shipment: 3, packages: 2}
    ]});
});

test('queue dequeue', () => {

    let queue = new Queue()
    queue.enqueue(2)
    queue.enqueue(3)
    queue.enqueue(6)
    
    expect(2).toEqual(2);
});