import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { ISupplier } from '@billinglib';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (request, reply) {
    const suppliers = await prisma.suppliers.findMany({
      select: {
        id: true,
        emails: true,
        name: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        licenseNumber: true,
        NTN: true,
        STN: true,
        telephones: true,
        TNNumber: true,
        TRNNumber: true,
        whatsapps: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        // incomment if you need all the invoices for this client
        // Invoices: true,
        _count: {
          select: {
            Invoices: {
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

    return reply.status(200).send(suppliers);
  });

  fastify.get('/:id', async function (request, reply) {
    const id = request.params['id'];

    const foundSupplier = await prisma.suppliers.findUnique({
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
      const requestBody = request.body as ISupplier;
      const newSupplier = await prisma.suppliers.create({
        data: {
          emails: requestBody.emails,
          name: requestBody.name,
          city: requestBody.city,
          telephones: requestBody.telephones,
          addressLine1: requestBody.addressLine1,
          addressLine2: requestBody.addressLine2 || '',
          whatsapps: requestBody.whatsapps || '',
          NTN: requestBody.NTN || '',
          STN: requestBody.STN || '',
          licenseNumber: requestBody.licenseNumber || '',
          TNNumber: requestBody.TNNumber || '',
          TRNNumber: requestBody.TRNNumber || '',
        },
      });

      return reply
        .status(201)
        .send({ message: 'Supplier created successfully', data: newSupplier });
    } catch (error) {
      console.log(error);
    }
  });

  fastify.put('/:id', async function (request, reply) {
    const id = request.params['id'];
    const requestBody = request.body as ISupplier;

    const updatedSupplier = await prisma.suppliers.update({
      where: { id: parseInt(id, 10) },
      data: {
        emails: requestBody.emails,
        name: requestBody.name,
        city: requestBody.city,
        telephones: requestBody.telephones,
        addressLine1: requestBody.addressLine1,
        addressLine2: requestBody.addressLine2 || '',
        whatsapps: requestBody.whatsapps || '',
        NTN: requestBody.NTN || '',
        STN: requestBody.STN || '',
        licenseNumber: requestBody.licenseNumber || '',
        TNNumber: requestBody.TNNumber || '',
        TRNNumber: requestBody.TRNNumber || '',
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

    const deletedSupplier = await prisma.suppliers.update({
      where: { id: parseInt(id, 10) },
      data: { deletedAt: new Date() },
    });

    return reply.status(200).send({
      message: 'Supplier deleted successfully',
      data: deletedSupplier,
    });
  });
}
