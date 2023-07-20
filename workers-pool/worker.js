const { parentPort, workerData } = require('node:worker_threads');

const { workerId } = workerData;
console.log(`запущен воркер ${workerId}`);
let currentJobs = 0;

parentPort.on('message', ({ typeMessage, data }) => {
	console.log(`получено в воркер ${workerId}`, { typeMessage, data });
	if (typeMessage === 'terminate') {
		parentPort.close();
		return;
	}
	if (typeMessage === 'imageJob') {
		const { urls, jobId } = data;
		currentJobs += urls.length;
		for (const url of urls) {
			const result = `${url} +`;
			currentJobs--;
			parentPort.postMessage({ result, status: 'progress', workerId, jobId });
		}
	
		parentPort.postMessage({ result: null, status: 'finish', workerId, jobId });
	}
});
