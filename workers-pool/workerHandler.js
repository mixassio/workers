const { Worker, postMessage } = require('node:worker_threads');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { EventEmitter } = require('node:stream');

class WorkerHandler {
	#workers = {};
	#jobs = {};
	#countWorkers = 0;
	constructor(countWorkers = 4) {
		this.#countWorkers = countWorkers;
		for (const i of [...Array(countWorkers).keys()]) {
			const worker = new Worker(path.join(__dirname, 'worker.js'), { workerData: { workerId: i } });
			worker.on('message', (data) => this.#answerWorker(data));
			this.#workers[i] = {
				worker,
				currentJobs: 0,
			};
		}
	}

	#answerWorker({ result, status, workerId, jobId }) {
		if (status === 'finish') {
			const { event } = this.#jobs[jobId];
			event.emit('finish');
			return;
		}
		this.#workers[workerId].currentJobs--;
		this.#jobs[jobId].result.push(result);
	}

	newJob(data) {
		const jobId = randomUUID();
		const event = new EventEmitter();
		this.#jobs[jobId] = { data, event, result: [] };
		const currentAllJobs =
			data.length +
			Object.values(this.#workers).reduce((acc, { currentJobs }) => acc + currentJobs, 0);
		const chunkSize = Math.ceil(currentAllJobs / this.#countWorkers);
		let cuurenPosition = 0;
		Object.entries(this.#workers).forEach(([_, { worker, currentJobs }]) => {
			const canCountPush = chunkSize - currentJobs;
			if (canCountPush > 0) {
				const chunkData = data.slice(cuurenPosition, cuurenPosition + canCountPush);
				cuurenPosition = cuurenPosition + canCountPush;
				currentJobs += canCountPush;
				worker.postMessage({ chunkData, jobId });
			}
		});
		return new Promise((resolve, reject) => {
			event.on('finish', () => {
				if (this.#jobs[jobId].result.length === this.#jobs[jobId].data.length) {
					console.log('finish event', this.#jobs);
					resolve(this.#jobs[jobId].result);
				}
			});
		});
	}

	closeWorkers() {
		Object.values(this.#workers).forEach((value) => value.worker.postMessage('terminate'));
	}
}

module.exports = WorkerHandler;
