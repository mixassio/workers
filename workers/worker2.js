const { parentPort } = require('node:worker_threads');

parentPort.on('message', (data) => {
  console.log('recived message:', data);
  const result = data + '@@@';

  parentPort.postMessage(result);
});
