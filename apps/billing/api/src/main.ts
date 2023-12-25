import Fastify from 'fastify';
import { app } from './app/app';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { jwtOptions } from './app/contants';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const server = Fastify({
  logger: true,
  ignoreDuplicateSlashes: true,
});

server.register(cors, {
  preflight: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  hideOptionsRoute: false,
});

server.register(fastifyJwt, jwtOptions);

server.addHook('onRequest', (req, reply, done) => {
  try {
    if (req.url !== '/user/login') server.jwt.verify(req.headers.authorization);
  } catch (error) {
    reply.status(401).send({
      message: "You've been been logged out. Log in again",
    });
  }
  done();
});

server.register(app);

server.listen({ port, host }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(
      server.printRoutes({ commonPrefix: false, includeHooks: false })
    );
    console.log(`[ ready ] http://${host}:${port}`);

    process.on('SIGINT', () => {
      console.log('\n\nServer shutdown at', new Date(), '\n\n');
      process.exit(0);
    });
  }
});
