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

async function main() {
  const promises = workerData.images.map((url) => {
    const tmp_file = path.join(`hash_${uuid_v4()}`);
    return pipeline(got.stream(url), fs.createWriteStream(tmp_file))
      .then(() => sharp(tmp_file)
          .rotate()
          .resize(320, 240)
          .toBuffer()
          .then( data => parentPort.postMessage(data))
          .catch( err => {}))
  });
  const result = await Promise.all(promises);
  parentPort.postMessage(result);
};

main();


