import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),

  API_DATABASE_PORT: z.coerce.number().default(5432),
  API_DATABASE_NAME: z.string(),
  API_DATABASE_USER: z.string(),
  API_DATABASE_PASSWORD: z.string(),
  DATABASE_URL: z.string()
})

const _env = envSchema.safeParse(process.env)


if (_env.success === false) {
  console.error('❌ Invalid environment variable', _env.error.format())
  throw new Error('❌ Invalid environment variable')
}

const CONNECTION_STRING: string = `postgresql://${_env.data.API_DATABASE_USER}:${_env.data.API_DATABASE_PASSWORD}@localhost:${_env.data.API_DATABASE_PORT}/${_env.data.API_DATABASE_NAME}?schema=public`
console.log(`🔗 CONNECTION_STRING: ${CONNECTION_STRING}`)

export const { API_DATABASE_NAME, API_DATABASE_PASSWORD, API_DATABASE_PORT, API_DATABASE_USER, DATABASE_URL, JWT_SECRET, NODE_ENV, PORT } = _env.data