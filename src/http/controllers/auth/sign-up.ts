import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { RegisterUsersService } from "@/services/register-users/register-users"
import { UsersRepository } from "@/repositories/users/users-repository"
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error"



export async function signUp(request: FastifyRequest, response: FastifyReply) {
  const registBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { name, email, password } = registBodySchema.parse(request.body)

  try {

    const registerUserService = new RegisterUsersService(new UsersRepository())

    await registerUserService.execute({ name, email, password })

    return response.status(201).send('user created')

  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return response.status(500).send({ error: err.message })
    }

    throw err
  }
}