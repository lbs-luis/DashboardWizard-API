import { UsersRepository } from "@/repositories/users/users-repository"
import { GetUserProfileService } from "@/services/get-user-profile/get-user-profile"
import { FastifyRequest, FastifyReply } from "fastify"

export async function profile(request: FastifyRequest, response: FastifyReply) {
  const getUserProfile = new GetUserProfileService(new UsersRepository())

  const { user } = await getUserProfile.execute({ userId: request.user.sub })

  response.status(200).send({
    user: {
      ...user,
      password_hash: undefined
    }
  })
}