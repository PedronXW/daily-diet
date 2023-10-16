declare module 'knex/types/tables' {
  export interface Tables {
    snacks: {
      id: string
      name: string
      description: string
      time: string
      stipulated: boolean
      session: string
    }
  }
}
