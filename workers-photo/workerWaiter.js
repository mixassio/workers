const { parentPort } = require('node:worker_threads');
let counter=0;
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
