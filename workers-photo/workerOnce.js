const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const util = require('node:util');
const stream = require('node:stream');
const pipeline = util.promisify(stream.pipeline);
const got = require('got');

console.log('получено в воркер1', workerData);
const promises = workerData.images.map((image) => {
  const tmp_file = path.join(`hash_${uuid_v4()}`);
  return pipeline(got.stream(url), fs.createWriteStream(tmp_file))
    .then(() => sharp(tmp_file)
        .rotate()
        .resize(320, 240)
        .toBuffer()
        .then( data => {})
        .catch( err => {}))
});

parentPort.postMessage(workerData);


const tmp_file = path.join(config.dirs.temp, `hash_${uuid_v4()}`);
