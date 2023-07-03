const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

const collection = [];

for (let i = 0; i < 10; i += 1) {
  collection[i] = i;
}
console.log('workerData', workerData);

parentPort.postMessage('start');
parentPort.postMessage(collection);
