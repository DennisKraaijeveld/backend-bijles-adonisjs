import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Participants extends BaseSchema {
  protected tableName = 'participants'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('thread_id').notNullable()
      table.integer('user_id').notNullable()
      table.timestamp('last_read')
      table.date('deleted_at')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
