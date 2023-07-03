const { parentPort } = require('node:worker_threads');

parentPort.on('message', (data) => {
  console.log('получено в воркер2', data);

  if (data === 'terminate') {
    parentPort.close();
    return;
  }

  const result = { data: data.images, status: 'ok' };

  parentPort.postMessage(result);
});
