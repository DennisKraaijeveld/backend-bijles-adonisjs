import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.string('name').notNullable()
      table.string('stripe_id').notNullable()
      table.string('stripe_status').notNullable()
      table.string('stripe_plan').notNullable()
      table.integer('quantity').notNullable()
      table.timestamp('trial_ends_at')
      table.timestamp('ends_at')
      table.index(['user_id', 'stripe_status'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
