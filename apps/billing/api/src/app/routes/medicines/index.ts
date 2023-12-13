// FIXME
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify';
import { DBClient } from '../../../clients/prisma';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (req, reply) {
    const prisma = DBClient();
    const data = await prisma.medicines.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: 'desc',
      },
      select: {
        genericName: true,
        formula: true,
        usage: true,
        sideEffect: true,
        dosage: true,
        brandId: true,
      },
    });
    return reply.status(200).send({ data });
  });

  fastify.post('/', async function (req, reply) {
    try {
      const prisma = DBClient();
      const requestBody = req.body as unknown as object;

      const data = await prisma.medicines.create({
        data: {
          // FIXME
          ...(requestBody as any),
        },
      });

      return reply.status(200).send({ data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

}
