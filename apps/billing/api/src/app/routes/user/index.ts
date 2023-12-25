import { FastifyInstance } from 'fastify';
import { DBClient } from '../../../clients/prisma';
import { IUser } from '@billinglib';

const prisma = DBClient();

export default async (instance: FastifyInstance) => {
  await intialSeed();
  instance.post('/login', async (req, rep) => {
    const requestBody = req.body as IUser;
    if (requestBody.username) {
      const loggedInUser = await prisma.user.findFirst({
        where: {
          email: {
            mode: 'insensitive',
            equals: requestBody.username,
          },
          password: requestBody.password,
          deletedAt: null,
        },
        select: {
          id: true,
          username: true,
          email: true,
          addressLine1: true,
          addressLine2: true,
          telephone: true,
          Role: {
            select: {
              Permissions: {
                select: {
                  Action: true,
                  Resource: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      });
      if (loggedInUser && loggedInUser.username) {
        await prisma.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            updatedAt: new Date(),
          },
        });

        const jwtToken = instance.jwt.sign(loggedInUser);

        delete loggedInUser.id;
        return rep.status(200).send({ ...loggedInUser, token: jwtToken });
      } else {
        return rep
          .status(200)
          .send({ message: 'Invalid username or password' });
      }
    }
    return rep.badRequest('No username found');
  });
  instance.get('/', (req, reply) => {
    const loggedInUser = instance.jwt.decode(req.headers.authorization);

    const jwtToken = instance.jwt.sign(loggedInUser);

    reply.status(200).send({ ...loggedInUser['payload'], token: jwtToken });
  });
};

export const intialSeed = async () => {
  const admin = await prisma.user.findFirst({
    where: {
      Role: {
        Permissions: {
          every: {
            Action: {
              action: '*',
            },
            Resource: {
              name: '*',
            },
          },
        },
      },
    },
  });

  if (!admin) {
    await prisma.user.create({
      data: {
        email: 'admin',
        password: 'admin',
        username: 'admin',
        Role: {
          connectOrCreate: {
            where: {
              id: 1,
            },
            create: {
              Permissions: {
                connectOrCreate: {
                  where: {
                    id: 1,
                  },
                  create: {
                    Action: {
                      connectOrCreate: {
                        where: {
                          id: 1,
                        },
                        create: {
                          action: '*',
                        },
                      },
                    },
                    Resource: {
                      connectOrCreate: {
                        where: {
                          id: 1,
                        },
                        create: {
                          name: '*',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }
};
