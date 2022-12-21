import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subjects extends BaseSchema {
  protected tableName = 'subjects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('subject_name').unique().notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
