import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tutor extends BaseSchema {
  protected tableName = 'tutors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('subject_id').nullable()
      table.decimal('hourly_rate').nullable()
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
