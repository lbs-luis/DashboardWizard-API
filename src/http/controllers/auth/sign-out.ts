import { env } from "@/../env";
import { FastifyRequest, FastifyReply } from "fastify";

export async function signOut(request: FastifyRequest, response: FastifyReply) {
  const cookies = request.cookies;
  for (const cookie in cookies) {
    if (cookies.hasOwnProperty(cookie)) {
      response.clearCookie(cookie, { domain: env.NODE_ENV === 'dev' ? 'localhost' : 'a colocar', path: '/' });
    }
  }
  response.status(200).send({ message: 'Signed out successfully' });
}
