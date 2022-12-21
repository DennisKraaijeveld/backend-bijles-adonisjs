import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SubscriptionItems extends BaseSchema {
  protected tableName = 'subscription_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('subscription_id').notNullable()
      table.string('stripe_id').notNullable()
      table.string('stripe_plan').notNullable()
      table.integer('quantity').notNullable()
      table.unique(['subscription_id', 'stripe_plan'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
