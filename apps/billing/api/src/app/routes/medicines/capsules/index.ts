import { DBClient } from '../../../../clients/prisma';
import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (req, reply) {
    const prisma = DBClient();
    const data = await prisma.capsules.findMany({
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
      const data = await prisma.capsules.create({
        data: {
          color: requestBody['color'],
          composition: requestBody['composition'],
          packaging: requestBody['packaging'],
          releaseProfile: requestBody['releaseProfile'],
          shape: requestBody['shape'],
          size: requestBody['size'],
          storageRequirements: requestBody['storageRequirements'],
          strength: requestBody['strength'],
          quantity: parseInt(requestBody['quantity']),
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
