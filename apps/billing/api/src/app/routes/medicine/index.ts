import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { IMedicine } from '@billinglib';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  // Get all suppliers
  fastify.get('/', async function () {
    const suppliers = await prisma.medicine.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        deletedAt: null,
      },
    });
    return suppliers;
  });

  fastify.get('/:id', async function (request, reply) {
    const id = request.params['id'];

    const foundSupplier = await prisma.medicine.findUnique({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!foundSupplier) {
      return reply.status(404).send({ message: 'Supplier not found' });
    }

    return reply.status(200).send({
      message: 'Supplier retrieved successfully',
      data: foundSupplier,
    });
  });

  fastify.post('/', async function (request, reply) {
    try {
      const requestBody = request.body as IMedicine;
      const newMedicine = await prisma.medicine.create({
        data: {
          name: requestBody.name,
          brand: requestBody.brand || '',
          formula: requestBody.formula || '',
          type: requestBody.type || '',
        },
      });

      return reply
        .status(201)
        .send({ message: 'Supplier created successfully', data: newMedicine });
    } catch (error) {
      console.log(error);
    }
  });

  fastify.put('/:id', async function (request, reply) {
    const id = request.params['id'];
    const requestBody = request.body as IMedicine;

    const updatedSupplier = await prisma.medicine.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: requestBody.name,
        brand: requestBody.brand || '',
        formula: requestBody.formula || '',
        type: requestBody.formula || '',
        updatedAt: new Date(),
      },
    });

    return reply.status(200).send({
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    });
  });

  fastify.delete('/:id', async function (request, reply) {
    const id = request.params['id'];

    const deletedSupplier = await prisma.medicine.update({
      where: { id: parseInt(id, 10) },
      data: { deletedAt: new Date() },
    });

    return reply.status(200).send({
      message: 'Supplier deleted successfully',
      data: deletedSupplier,
    });
  });
}
