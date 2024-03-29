import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '60m',
  },
})
app.register(fastifyCookie)

/** Register Routes */
app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, rep) => {
  if (error instanceof ZodError) {
    return rep.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
  }
  if (env.NODE_ENV !== 'prod') {
    console.log(error)
  } else {
    // TODO: here we should log to an external tool
  }

  return rep.status(500).send({ message: 'Internal server error!' })
})
