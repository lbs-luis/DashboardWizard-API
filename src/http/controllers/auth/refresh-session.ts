import { FastifyRequest, FastifyReply } from "fastify"

export async function refreshSession(request: FastifyRequest, response: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true }).catch((error) => {
    // console.log(request.cookies)
    // console.log(error)
    response.status(401).send({ message: 'Unauthorized.' })
  })

  const { role } = request.user

  const token = await response.jwtSign(
    { role }, {
    sign: {
      sub: request.user.sub
    }
  })

  const refreshToken = await response.jwtSign(
    { role }, {
    sign: {
      sub: request.user.sub,
      expiresIn: '3d',
    }
  })

  return response
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: 'none',
      httpOnly: true
    })
    .status(200)
    .send({ token })
}