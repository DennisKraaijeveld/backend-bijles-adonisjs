import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Student extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('subject_id').nullable()
      table.bigInteger('total_reviews').nullable()
      table.decimal('average_rating').nullable()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
