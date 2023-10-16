import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExist(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const session = req.cookies.session

  if (!session) {
    reply.code(401).send({ message: 'Unauthorized' })
  }
}
