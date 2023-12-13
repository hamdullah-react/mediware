import Fastify from 'fastify';
import { app } from './app/app';
import cors from '@fastify/cors';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
server.register(app);

server.register(cors, { hideOptionsRoute: true });

// Start listening.
server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);
    console.log(server.printRoutes({ commonPrefix: true }));

    process.on('SIGINT', () => {
      console.log('\n\nServer shutdown at', new Date(), '\n\n');
      process.exit(0);
    });
  }
});
