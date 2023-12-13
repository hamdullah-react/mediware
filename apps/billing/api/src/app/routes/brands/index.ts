import { FastifyInstance } from 'fastify';
import { DBClient } from '../../../clients/prisma';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (req, reply) {
    try {
      const prisma = DBClient();
      const data = await prisma.brands.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          id: 'desc',
        },
      });
      return reply.status(200).send({ data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  fastify.post('/', async function (req, reply) {
    const requestBody = req.body as unknown as object;
    const conn = DBClient();
    console.log({
      address: requestBody['address'],
      email: requestBody['email'],
      name: requestBody['name'],
      telephone: requestBody['telephone'],
    });

    try {
      const data = await conn.brands.create({
        data: {
          address: requestBody['address'],
          email: requestBody['email'],
          name: requestBody['name'],
          telephone: requestBody['telephone'],
        },
      });

      return reply.status(200).send({ data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  fastify.delete('/:id', async function (req, reply) {
    const conn = DBClient();

    try {
      const data = await conn.brands.update({
        where: {
          id: parseInt(req.params['id'] as string),
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return reply.status(200).send({ data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
}
