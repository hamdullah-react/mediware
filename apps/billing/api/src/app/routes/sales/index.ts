import { FastifyInstance } from 'fastify';
import { DBClient } from '../../../clients/prisma';
import { ISaleInvoice } from '@billinglib';

const prisma = DBClient();

export default async (instance: FastifyInstance) => {
  instance.get('/', async (req, reply) => {
    const data = await prisma.saleInvoices.findMany({
      select: {
        id: true,
        customerName: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        whatsapp: true,
        dicountPrice: true,
        saleInvoiceId: true,
        telephone: true,
        totalRecieved: true,
        Items: {
          select: {
            id: true,
            comments: true,
            createdAt: true,
            quantity: true,
            quantitySoldFromPack: true,
            unitSalePrice: true,
            Medicine: {
              select: {
                name: true,
                brand: true,
                code: true,
                formula: true,
                id: true,
                packing: true,
                type: true,
                unitTakePrice: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            Items: {
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
    reply.status(200).send(data);
  });

  instance.post('/', async (req, reply) => {
    const requestBody = req.body as ISaleInvoice;
    try {
      const invoice = await prisma.saleInvoices.create({
        data: {
          customerName: requestBody.customerName,
          saleInvoiceId: requestBody.saleInvoiceId,
          address: requestBody.address,
          telephone: requestBody.telephone,
          email: requestBody.email,
          whatsapp: requestBody.whatsapp,
          dicountPrice: parseFloat(String(requestBody.dicountPrice)) || 0,
          totalRecieved: parseFloat(String(requestBody.totalRecieved)) || 0,
        },
      });

      const tasks = requestBody.Items.map((invoiceItem) =>
        prisma.saleInvoiceItems.create({
          data: {
            comments: invoiceItem.comments,
            quantity: parseFloat(String(invoiceItem.quantity)) || 0,
            unitSalePrice: parseFloat(String(invoiceItem.unitSalePrice)) || 0,
            quantitySoldFromPack:
              parseFloat(String(invoiceItem.quantitySoldFromPack)) || 0,
            SaleInvoices: {
              connect: {
                id: invoice.id,
              },
            },
            Medicine: {
              connectOrCreate: {
                create: {
                  name: invoiceItem.Medicine.name,
                  packing: invoiceItem.Medicine.packing,
                  brand: invoiceItem.Medicine.brand,
                  code: invoiceItem.Medicine.code,
                  type: invoiceItem.Medicine.type,
                  formula: invoiceItem.Medicine.formula,
                  unitTakePrice:
                    parseFloat(String(invoiceItem.Medicine.unitTakePrice)) || 0,
                },
                where: {
                  id: invoiceItem.Medicine.id,
                },
              },
            },
          },
        })
      );

      const result = await Promise.allSettled(tasks);
      return reply.status(200).send(result);
    } catch (error) {
      return reply.status(500).send(error);
    }
  });

  instance.put('/:id', async (req, reply) => {
    const requestBody = req.body as ISaleInvoice;
    const id = parseInt(req.params['id']);

    const data = await prisma.saleInvoices.update({
      where: {
        id: id,
      },
      data: {
        address: requestBody.address,
        customerName: requestBody.customerName,
        email: requestBody.email,
        saleInvoiceId: requestBody.saleInvoiceId,
        telephone: requestBody.telephone,
        whatsapp: requestBody.whatsapp,
        totalRecieved: parseFloat(String(requestBody.totalRecieved)),
        dicountPrice: parseFloat(String(requestBody.dicountPrice)),
        updatedAt: new Date(),
      },
    });

    await prisma.saleInvoiceItems.deleteMany({
      where: {
        saleInvoicesId: id,
      },
    });

    const tasks = requestBody.Items.map(
      async (item) =>
        await prisma.saleInvoiceItems.create({
          data: {
            quantitySoldFromPack: parseFloat(String(item.quantitySoldFromPack)),
            unitSalePrice: parseFloat(String(item.unitSalePrice)),
            quantity: parseFloat(String(item.quantity)),
            comments: item.comments,
            SaleInvoices: {
              connect: {
                id: id,
              },
            },
            Medicine: {
              connect: {
                id: item.Medicine.id,
              },
            },
          },
        })
    );

    await Promise.allSettled(tasks);

    reply.status(200).send(data);
  });

  instance.delete('/:id', async (req, reply) => {
    const id = parseInt(req.params['id']);

    const response = await prisma.saleInvoices.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    reply.status(200).send(response);
  });
};
