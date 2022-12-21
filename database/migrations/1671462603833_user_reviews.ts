import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserReviews extends BaseSchema {
  protected tableName = 'user_reviews'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.integer('author_id').notNullable()
      table.integer('rating').notNullable()
      table.string('description').notNullable()
      table.boolean('status').notNullable()
      table.date('deleted_at')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
