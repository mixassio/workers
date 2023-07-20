const WorkerHandler = require('./workerHandler');

const fastify = require('fastify')({
	logger: true,
});

const workerHandler = new WorkerHandler();

fastify.post('/images', async (request, reply) => {
	console.log(request.body);
	const result = await workerHandler.newJob(request.body);
	return { result };
});

fastify.addHook('onClose', (instance, done) => {
	workerHandler.closeWorkers();
	done();
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		workerHandler.closeWorkers();
		process.exit(1);
	}
};
start();
