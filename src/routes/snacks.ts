import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function snacksRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    const session = req.cookies.session

    const snacks = await knex('snacks').where({ session })

    return reply.send(snacks)
  })

  app.get('/:id', async (req, reply) => {
    const session = req.cookies.session

    const getTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getTransactionParamsSchema.parse(req.params)

    const snack = await knex('snacks').where({ id, session }).first()

    return reply.send(snack)
  })

  app.get('/stats', async (req, reply) => {
    const session = req.cookies.session

    const stipulatedCount = await knex('snacks')
      .where({ session, stipulated: true })
      .count()

    const unstipulatedCount = await knex('snacks')
      .where({
        session,
        stipulated: false,
      })
      .count()

    const snackCount = await knex('snacks').where({ session }).count()

    const stipulatedSequences: any = []
    let index = 0

    const snacks = await knex('snacks').where({ session }).orderBy('time')

    stipulatedSequences[index] = []
    for (const snack of snacks) {
      if (snack.stipulated === 1) {
        stipulatedSequences[index].push(snack)
      } else {
        if (stipulatedSequences[index].length > 0) {
          index++
          stipulatedSequences[index] = []
        }
      }
    }

    stipulatedSequences.sort((a: any, b: any) => {
      return b.length - a.length
    })

    return reply.send({
      stipulatedCount: stipulatedCount[0]['count(*)'],
      unstipulatedCount: unstipulatedCount[0]['count(*)'],
      snackCount: snackCount[0]['count(*)'],
      stipulatedSequences: stipulatedSequences[0],
    })
  })

  app.post('/', async (req, reply) => {
    const createSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      time: z.string(),
      stipulated: z.boolean(),
    })

    const { name, description, time, stipulated } = createSnackBodySchema.parse(
      req.body,
    )

    let session = req.cookies.session

    if (!session) {
      session = randomUUID()

      reply.cookie('session', session, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    }

    await knex('snacks').insert({
      id: randomUUID(),
      name,
      description,
      time,
      stipulated,
      session,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (req, reply) => {
    const session = req.cookies.session

    const updateTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const updateTransactionBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      time: z.string().optional(),
      stipulated: z.boolean().optional(),
    })

    const { id } = updateTransactionParamsSchema.parse(req.params)

    const body = updateTransactionBodySchema.parse(req.body)

    await knex('snacks').where({ id, session }).update(body)
  })

  app.delete('/:id', async (req, reply) => {
    const session = req.cookies.session

    const deleteTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = deleteTransactionParamsSchema.parse(req.params)

    await knex('snacks').where({ id, session }).delete()
  })
}
