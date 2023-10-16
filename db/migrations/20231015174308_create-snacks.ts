import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('stipulated').notNullable()
    table.text('time').notNullable()
    table.text('session')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks')
}
