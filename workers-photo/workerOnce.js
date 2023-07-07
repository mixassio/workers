const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const util = require('node:util');
const stream = require('node:stream');
const pipeline = util.promisify(stream.pipeline);
const got = require('got');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { v4: uuid_v4 } = require('uuid');

console.log('получено в воркер1', workerData);
let counterCurrent = workerData.images.length;
async function main() {
  workerData.images.forEach((url) => {
    const tmp_file = path.join(`hash_${uuid_v4()}`);
    return got.stream(url)
      .pipe(sharp()
        .rotate()
        .resize(320, 240)
        .png())
      .pipe(fs.createWriteStream(tmp_file))
      .on('finish', () => {
        counterCurrent --;
        parentPort.postMessage(counterCurrent);
      })

  })
  parentPort.postMessage('Done');
};

main();


