import { DBClient } from '../../../../clients/prisma';
import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (req, reply) {
    const prisma = DBClient();
    const data = await prisma.syrups.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return reply.status(200).send({ data });
  });

  fastify.post('/', async function (req, reply) {
    try {
      const prisma = DBClient();
      const requestBody = req.body as unknown as object;
      const data = await prisma.syrups.create({
        data: {
          ingredients: requestBody['ingredients'],
          numOfBottles: parseFloat(requestBody['numOfBottles']),
          storageConditions: requestBody['storageConditions'],
          code: requestBody['code'],
          volume: requestBody['volume'],
          medicineId: parseInt(requestBody['medicineId']),
        },
      });
      return reply.status(200).send({ data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  // fastify.delete('/:id', async function (req, reply) {});
}
