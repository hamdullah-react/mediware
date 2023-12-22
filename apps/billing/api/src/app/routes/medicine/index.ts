import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { IMedicine } from '@billinglib';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    const suppliers = await prisma.medicine.findMany({
      select: {
        id: true,
        brand: true,
        formula: true,
        name: true,
        type: true,
        code: true,
        // uncomment if you need all the invoices containing this medicines
        // InvoiceMedicine: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        _count: {
          select: {
            InvoiceMedicine: true,
          },
        },
      },
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: 'desc',
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
          code: requestBody.code || '',
        },
      });

      return reply
        .status(200)
        .send({ message: 'Medicine created successfully', data: newMedicine });
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
