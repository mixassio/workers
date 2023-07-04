const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const path = require('path');

const images = [
  'https://aff.bstatic.com/images/hotel/max500/428/42837405.jpg',
  'https://q-xx.bstatic.com/images/hotel/max500/428/42837284.jpg',
  'https://aff.bstatic.com/images/hotel/max500/428/42837530.jpg',
];

const worker1 = new Worker(path.join(__dirname, 'workerOnce.js'), { workerData: { images } });

worker1.postMessage('start');

worker1.on('message', (data) => {
  console.log('Получено от воркера1:', data);
});

worker1.on('exit', (code) => {
  console.log('Worker1 stopped with exit code', code);
});

// как его запускать в веб приложении и как к нему обращаться из других точек приложения
const worker2 = new Worker(path.join(__dirname, 'workerWaiter.js'));

worker2.on('message', (data) => {
  console.log('Получено от воркера2:', data);
});

worker2.on('exit', (code) => {
  console.log('Worker2 stopped with exit code', code);
});

worker2.postMessage({ images });

worker2.postMessage('images');

worker2.postMessage('terminate');
