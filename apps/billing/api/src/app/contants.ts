import { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyRegisterOptions } from 'fastify';

export const jwtOptions: FastifyRegisterOptions<FastifyJWTOptions> = {
  secret: 'mediware2000-solutionave-2023',
  sign: {
    algorithm: 'HS512',
    expiresIn: '2d',
  },
  decode: {
    complete: true,
  },
};
