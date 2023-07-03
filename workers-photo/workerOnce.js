const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

console.log('получено в воркер1', workerData);

parentPort.postMessage(workerData);
