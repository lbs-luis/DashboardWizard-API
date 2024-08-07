import { z } from "zod"
import { FastifyRequest, FastifyReply } from "fastify"
import { UsersRepository } from "@/repositories/users/users-repository"
import { AuthenticateService } from "@/services/authenticate/authenticate"
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error"


export async function signIn(request: FastifyRequest, response: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateService = new AuthenticateService(new UsersRepository())

    const { user } = await authenticateService.execute({ email, password, })

    const token = await response.jwtSign(
      {
        role: user.role
      }, {
      sign: {
        sub: user.id
      }
    })

    const refreshToken = await response.jwtSign(
      {
        role: user.role
      }, {
      sign: {
        sub: user.id,
        expiresIn: '3d',
      }
    })

    return response.setCookie('refreshToken', refreshToken, { path: '/', secure: true, sameSite: 'none', httpOnly: true }).status(200).send({ token })
    // return response.setCookie('refreshToken', refreshToken, { path: '/', secure: false, sameSite: 'lax', httpOnly: false }).status(200).send({ token })

  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return response.status(400).send({ error: err.message })
    }

    throw err
  }
}