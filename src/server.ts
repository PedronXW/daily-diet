import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { env } from './env'
import { snacksRoutes } from './routes/snacks'

const app = fastify()

app.register(cookie)

app.register(snacksRoutes, { prefix: '/snacks' })

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('Server listening on port 3000')
})
