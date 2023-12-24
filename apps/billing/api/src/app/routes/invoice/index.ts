import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { APP_DB_TIME_FORMAT, IInvoice } from '@billinglib';
import moment from 'moment';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async (req, rep) => {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        bookingDriver: true,
        invoiceNumber: true,
        createdAt: true,
        deletedAt: true,
        deliveredBy: true,
        invoiceDate: true,
        salesTax: true,
        Supplier: true,
        status: true,
        total: true,
        updatedAt: true,
        advTax: true,
        InvoiceMedicine: {
          select: {
            advTax: true,
            batchIdentifier: true,
            createdAt: true,
            deletedAt: true,
            discountedAmount: true,
            discountPercentage: true,
            expirey: true,
            id: true,
            Invoice: true,
            invoiceId: true,
            medicineId: true,
            netAmount: true,
            quantity: true,
            gst: true,
            unitSalePrice: true,
            updatedAt: true,
            Medicine: {
              select: {
                unitTakePrice: true,
                packing: true,
                brand: true,
                createdAt: true,
                formula: true,
                deletedAt: true,
                name: true,
                type: true,
                code: true,
                id: true,
                updatedAt: true,
              },
            },
          },
        },
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

    rep.status(200).send(invoices);
  });

  fastify.post('/', async (req, rep) => {
    try {
      const requestBody = req.body as IInvoice;

      const newInvoice = await prisma.invoice.create({
        data: {
          invoiceNumber: requestBody.invoiceNumber,
          invoiceDate: moment(requestBody.invoiceDate).format(
            APP_DB_TIME_FORMAT
          ),
          bookingDriver: requestBody.bookingDriver,
          deliveredBy: requestBody.deliveredBy,
          salesTax: parseFloat(String(requestBody.salesTax)),
          status: requestBody.status,
          total: parseFloat(String(requestBody.total)),
          advTax: parseFloat(String(requestBody.advTax)),
          Supplier: {
            connect: {
              id: requestBody.Supplier.id,
            },
          },
        },
      });

      const creationTasks = requestBody.InvoiceMedicine.map(
        (invoiceMedicine) => {
          if (invoiceMedicine.Medicine.id)
            return prisma.invoiceMedicine.create({
              data: {
                batchIdentifier: invoiceMedicine.batchIdentifier,
                quantity: parseInt(String(invoiceMedicine.quantity)) || 1,

                expirey: moment(invoiceMedicine.expirey).format(
                  APP_DB_TIME_FORMAT
                ),
                unitSalePrice: parseFloat(
                  String(invoiceMedicine.unitSalePrice)
                ),
                discountPercentage:
                  parseFloat(String(invoiceMedicine.discountPercentage)) || 0,
                gst: parseFloat(String(invoiceMedicine.gst)),
                netAmount: parseFloat(String(invoiceMedicine.netAmount)) || 0,
                advTax: parseFloat(String(invoiceMedicine.advTax)) || 0,
                discountedAmount: parseFloat(
                  String(invoiceMedicine.discountedAmount)
                ),
                Invoice: {
                  connect: {
                    id: newInvoice.id,
                  },
                },
                Medicine: {
                  connect: {
                    id: invoiceMedicine.Medicine.id,
                  },
                },
              },
            });
          else {
            return prisma.invoiceMedicine.create({
              data: {
                batchIdentifier: invoiceMedicine.batchIdentifier,
                quantity: parseInt(String(invoiceMedicine.quantity)) || 1,

                expirey: moment(invoiceMedicine.expirey).format(
                  APP_DB_TIME_FORMAT
                ),

                unitSalePrice: parseFloat(
                  String(invoiceMedicine.unitSalePrice)
                ),
                discountPercentage:
                  parseFloat(String(invoiceMedicine.discountPercentage)) || 0,
                gst: parseFloat(String(invoiceMedicine.gst)),
                netAmount: parseFloat(String(invoiceMedicine.netAmount)) || 0,
                advTax: parseFloat(String(invoiceMedicine.advTax)) || 0,
                discountedAmount: parseFloat(
                  String(invoiceMedicine.discountedAmount)
                ),
                Invoice: {
                  connect: {
                    id: newInvoice.id,
                  },
                },
                Medicine: {
                  create: {
                    name: invoiceMedicine.Medicine.name,
                    brand: invoiceMedicine.Medicine.brand,
                    formula: invoiceMedicine.Medicine.formula,
                    type: invoiceMedicine.Medicine.type,
                    packing: invoiceMedicine.Medicine.packing,
                    unitTakePrice: parseFloat(
                      String(invoiceMedicine.Medicine.unitTakePrice)
                    ),
                  },
                },
              },
            });
          }
        }
      );

      const results = await Promise.all(creationTasks);

      rep.send(200).send({ data: results });
    } catch (error) {
      console.log(error);
    }
  });

  fastify.delete('/:id', async function (request, reply) {
    const id = request.params['id'];

    const deletedInvoice = await prisma.invoice.update({
      where: { id: parseInt(id, 10) },
      data: { deletedAt: new Date() },
    });

    return reply.status(200).send({
      message: 'Invoice deleted successfully',
      data: deletedInvoice,
    });
  });
}
