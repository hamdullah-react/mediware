import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { IMedicine } from '@billinglib';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (request, reply) {
    const medicine = await prisma.medicines.findMany({
      select: {
        id: true,
        brand: true,
        formula: true,
        name: true,
        suplierCode: true,
        type: true,
        code: true,
        unitTakePrice: true,
        numStrips: true,
        numOfUnitsOnStrip: true,
        createdAt: true,
        updatedAt: true,
        packing: true,
        deletedAt: true,
        _count: {
          select: {
            InvoiceMedicines: {
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

    const medicineCountSupplierInvoice = await prisma.invoiceMedicines.groupBy({
      where: {
        deletedAt: null,
        Invoice: {
          deletedAt: null,
        },
      },
      by: 'medicineId',
      _sum: {
        quantity: true,
      },
    });

    const medicineCountCustomerInvoice = await prisma.saleInvoiceItems.groupBy({
      where: {
        deletedAt: null,
        SaleInvoices: {
          deletedAt: null,
        },
      },
      by: 'medicinesId',
      _sum: {
        quantity: true,
      },
    });

    const medicineWithCount = medicine?.map((medicine) => {
      const countPurchase = medicineCountSupplierInvoice?.find(
        (mc) => mc.medicineId === medicine.id
      );
      const countSold = medicineCountCustomerInvoice?.find(
        (mc) => mc.medicinesId === medicine.id
      );
      const total =
        (countPurchase?._sum?.quantity || 0) - (countSold?._sum?.quantity || 0);

      return {
        ...medicine,
        quantityInStock: total,
      };
    });

    return reply
      .status(200)
      .send(
        medicineWithCount.sort((a, b) =>
          a.quantityInStock > b.quantityInStock ? 1 : -1
        )
      );
  });

  fastify.get('/:id', async function (request, reply) {
    const id = request.params['id'];

    const foundMedicine = await prisma.medicines.findUnique({
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
      const newMedicine = await prisma.medicines.create({
        data: {
          name: requestBody.name,
          brand: requestBody.brand || '',
          formula: requestBody.formula || '',
          type: requestBody.type || '',
          code: requestBody.code || '',
          suplierCode: requestBody.suplierCode || '',
          packing: requestBody.packing || '',
          unitTakePrice: parseFloat(String(requestBody.unitTakePrice)) || 0,
          numStrips: parseFloat(String(requestBody.numStrips)) || 0,
          numOfUnitsOnStrip:
            parseFloat(String(requestBody.numOfUnitsOnStrip)) || 0,
        },
      });

      return reply
        .status(200)
        .send({ message: 'Medicine created successfully', data: newMedicine });
    } catch (error) {
      return reply.status(500).send({ message: "Couldn't create medicine" });
    }
  });

  fastify.put('/:id', async function (request, reply) {
    const id = request.params['id'];
    const requestBody = request.body as IMedicine;

    const updatedMedicine = await prisma.medicines.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: requestBody.name,
        brand: requestBody.brand || '',
        formula: requestBody.formula || '',
        type: requestBody.type || '',
        code: requestBody.code || '',
        suplierCode: requestBody.suplierCode || '',
        packing: requestBody.packing || '',
        unitTakePrice: parseFloat(String(requestBody.unitTakePrice)),
        numStrips: parseFloat(String(requestBody.numStrips)),
        numOfUnitsOnStrip: parseFloat(String(requestBody.numOfUnitsOnStrip)),
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

    const deletedMedicine = await prisma.medicines.update({
      where: { id: parseInt(id, 10) },
      data: { deletedAt: new Date() },
    });

    return reply.status(200).send({
      message: 'Medicine deleted successfully',
      data: deletedMedicine,
    });
  });
}
