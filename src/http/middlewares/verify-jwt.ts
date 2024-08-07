import { error } from "console";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, response: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return response.status(401).send({ error: 'Unauthorized.' })
  }
}