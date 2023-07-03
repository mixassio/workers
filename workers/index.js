const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const path = require('path');

const worker = new Worker(path.join(__dirname, 'worker1.js'), { workerData: { d: 3 } });
worker.on('message', (data) => {
  console.log('Worker data:', data);
  worker.postMessage(data);
});
worker.postMessage('start');
