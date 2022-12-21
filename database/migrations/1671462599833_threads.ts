import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Threads extends BaseSchema {
  protected tableName = 'threads'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('subject').notNullable()
      table.date('deleted_at')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
