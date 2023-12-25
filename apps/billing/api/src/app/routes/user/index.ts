import { FastifyInstance } from 'fastify';
import { DBClient } from '../../../clients/prisma';
import { IUser } from '@billinglib';

const prisma = DBClient();

export default async (instance: FastifyInstance) => {
  await intialSeed();
  instance.post('/login', async (req, rep) => {
    const requestBody = req.body as IUser;
    if (requestBody.username) {
      const loggedInUser = await prisma.users.findFirst({
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
        await prisma.users.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            lastLoginAt: new Date(),
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
  instance.get('/', async (req, reply) => {
    try {
      const loggedInUser = instance.jwt.decode(req.headers.authorization);
      const jwtToken = instance.jwt.sign(loggedInUser);
      await prisma.users.update({
        where: {
          id: parseInt(loggedInUser['payload']['id']),
        },
        data: {
          lastLoginAt: new Date(),
        },
      });
      reply.status(200).send({ ...loggedInUser['payload'], token: jwtToken });
    } catch (error) {
      reply
        .status(401)
        .send({ message: "You've been unauthorized, please re-login" });
    }
  });
};

export const intialSeed = async () => {
  const admin = await prisma.users.findFirst({
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
    await prisma.users.create({
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
