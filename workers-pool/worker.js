const { parentPort, workerData } = require('node:worker_threads');

parentPort.on('message', (data) => {
  console.log('получено в воркер2', data);
  con
  if (data === 'terminate') {
    parentPort.close();
    return;
  }

  const result = { data: data.images, status: 'ok' };

  parentPort.postMessage(result);
});
