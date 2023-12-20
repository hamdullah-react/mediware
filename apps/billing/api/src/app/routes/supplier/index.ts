import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { ISupplier } from '@billinglib';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  // Get all suppliers
  fastify.get('/', async function () {
    const suppliers = await prisma.supplier.findMany();
    return suppliers;
  });
  fastify.get('/:id', async function (request, reply) {
    const id = request.params['id'];

    // Retrieve supplier by ID
    const foundSupplier = await prisma.supplier.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!foundSupplier) {
      return reply.status(404).send({ message: 'Supplier not found' });
    }

    return reply
      .status(200)
      .send({
        message: 'Supplier retrieved successfully',
        data: foundSupplier,
      });
  });

  // Create a new supplier
  fastify.post('/', async function (request, reply) {
    try {
      const requestBody = request.body as ISupplier;
      const newSupplier = await prisma.supplier.create({
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
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }, // Assuming the request body contains the necessary fields for creating a new supplier
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

    // Update supplier by ID
    const updatedSupplier = await prisma.supplier.update({
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

    return reply
      .status(200)
      .send({
        message: 'Supplier updated successfully',
        data: updatedSupplier,
      });
  });

  fastify.delete('/:id', async function (request, reply) {
    const id = request.params['id'];

    // Delete supplier by ID
    const deletedSupplier = await prisma.supplier.delete({
      where: { id: parseInt(id, 10) },
    });

    return reply
      .status(200)
      .send({
        message: 'Supplier deleted successfully',
        data: deletedSupplier,
      });
  });
}
