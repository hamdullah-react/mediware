import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { IMedicine } from '@billinglib';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (request, reply) {
    const medicine = await prisma.medicine.findMany({
      select: {
        id: true,
        brand: true,
        formula: true,
        name: true,
        type: true,
        code: true,
        unitTakePrice: true,
        // uncomment if you need all the invoices containing this medicines
        // InvoiceMedicine: true,
        createdAt: true,
        updatedAt: true,
        packing: true,
        deletedAt: true,
        _count: {
          select: {
            InvoiceMedicine: {
              where: {
                deletedAt: null,
              },
            },
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

    const medicineCount = await prisma.invoiceMedicine.groupBy({
      where: {
        deletedAt: null,
      },
      by: 'medicineId',
      _sum: {
        quantity: true,
      },
    });

    const medicineWithCount = medicine?.map((medicine) => {
      const count = medicineCount?.find((mc) => mc.medicineId === medicine.id);

      return {
        ...medicine,
        quantityInStock: count?._sum?.quantity || 0,
      };
    });

    return reply.status(200).send(medicineWithCount);
  });

  fastify.get('/:id', async function (request, reply) {
    const id = request.params['id'];

    const foundMedicine = await prisma.medicine.findUnique({
      where: { id: parseInt(id), deletedAt: null },
    });

    if (!foundMedicine) {
      return reply.status(404).send({ message: 'Medicine not found' });
    }

    return reply.status(200).send({
      message: 'Medicine retrieved successfully',
      data: foundMedicine,
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
          packing: requestBody.packing || '',
          unitTakePrice: parseFloat(String(requestBody.unitTakePrice)) || 0,
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

    const updatedMedicine = await prisma.medicine.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: requestBody.name,
        brand: requestBody.brand || '',
        formula: requestBody.formula || '',
        type: requestBody.type || '',
        code: requestBody.code || '',
        packing: requestBody.packing || '',
        unitTakePrice: parseFloat(String(requestBody.unitTakePrice)),
        updatedAt: new Date(),
      },
    });

    return reply.status(200).send({
      message: 'Medicine updated successfully',
      data: updatedMedicine,
    });
  });

  fastify.delete('/:id', async function (request, reply) {
    const id = request.params['id'];

    const deletedMedicine = await prisma.medicine.update({
      where: { id: parseInt(id, 10) },
      data: { deletedAt: new Date() },
    });

    return reply.status(200).send({
      message: 'Medicine deleted successfully',
      data: deletedMedicine,
    });
  });
}
