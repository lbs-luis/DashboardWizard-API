import fastify from "fastify";
import { appRoutes } from "@/http/routes";
import { ZodError } from "zod";
import { JWT_SECRET, NODE_ENV } from "../env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'



export const app = fastify()

app.register(cors, {
  origin: (origin, cb) => {
    if (NODE_ENV === 'dev') {
      cb(null, true);
      return;
    }
    // TODO: make CORS rules for production
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  credentials: true,
});

app.register(fastifyJwt, {
  secret: JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m'
  }
})
app.register(fastifyCookie, {
  secret: JWT_SECRET,
  parseOptions: {}
});

app.register(appRoutes)

app.setErrorHandler((error, _, response) => {
  if (error instanceof ZodError) return response.status(400).send({
    message: 'Validation error.', issues: error.format()
  })

  if (NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: here we should log to an external tool like DataDog/NewRelic/Sentry
  }
  return response.status(500).send({ message: 'Internal server error.' })
})

