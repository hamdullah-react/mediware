import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { IInvoice } from '@billinglib';
import moment from 'moment';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async (req, rep) => {
    const invoices = await prisma.invoice.findMany({
      where: {
        deletedAt: null,
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
            'YYYY-MM-DDTHH:mm:ss.SSSZ'
          ),
          bookingDriver: requestBody.bookingDriver,
          deliveredBy: requestBody.deliveredBy,
          salesTax: parseFloat(requestBody.salesTax.toString()),
          status: requestBody.status,
          total: parseFloat(requestBody.total.toString()),
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
                quantity: parseInt(invoiceMedicine.quantity.toString()) || 1,
                packing: invoiceMedicine.packing,
                expirey: moment(invoiceMedicine.expirey).format(
                  'YYYY-MM-DDTHH:mm:ss.SSSZ'
                ),
                unitTakePrice: parseFloat(
                  invoiceMedicine.unitTakePrice.toString()
                ),
                unitSalePrice: parseFloat(
                  invoiceMedicine.unitSalePrice.toString()
                ),
                discountPercentage:
                  parseFloat(invoiceMedicine.discountPercentage.toString()) ||
                  0,
                netAmount:
                  parseFloat(invoiceMedicine.netAmount.toString()) || 0,
                advTax: parseFloat(invoiceMedicine.advTax.toString()) || 0,
                discountedAmount: parseFloat(
                  invoiceMedicine.discountedAmount.toString()
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
                quantity: parseInt(invoiceMedicine.quantity.toString()) || 1,
                packing: invoiceMedicine.packing,
                expirey: moment(invoiceMedicine.expirey).format(
                  'YYYY-MM-DDTHH:mm:ss.SSSZ'
                ),
                unitTakePrice: parseFloat(
                  invoiceMedicine.unitTakePrice.toString()
                ),
                unitSalePrice: parseFloat(
                  invoiceMedicine.unitSalePrice.toString()
                ),
                discountPercentage:
                  parseFloat(invoiceMedicine.discountPercentage.toString()) ||
                  0,
                netAmount:
                  parseFloat(invoiceMedicine.netAmount.toString()) || 0,
                advTax: parseFloat(invoiceMedicine.advTax.toString()) || 0,
                discountedAmount: parseFloat(
                  invoiceMedicine.discountedAmount.toString()
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
}
