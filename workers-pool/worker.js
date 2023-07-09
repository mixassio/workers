const { parentPort, workerData } = require('node:worker_threads');

const { workerId } = workerData;
console.log(`запущен воркер ${workerId}`);
let currentJobs = 0;

parentPort.on('message', (data) => {
	console.log(`получено в воркер ${workerId}`, data);
	if (data === 'terminate') {
		parentPort.close();
		return;
	}
	const { chunkData, jobId } = data;
	currentJobs += chunkData.length;
	for (const chunk of chunkData) {
		const result = `${chunk} +`;
		currentJobs--;
		parentPort.postMessage({ result, status: 'progress', workerId, jobId });
	}

	parentPort.postMessage({ result: null, status: 'finish', workerId, jobId });
});
