import { FastifyInstance } from 'fastify';

export default async (instance: FastifyInstance) => {
  instance.get('/', (req, reply) => {
    reply.status(200).send({ message: 'hello' });
  });
};
