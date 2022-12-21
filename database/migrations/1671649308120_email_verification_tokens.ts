import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'email_verification_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()
      table
        .bigInteger('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE') // Delete this profile when user is deleted
      table.string('email').notNullable().unique()
      table.string('verification_token').notNullable().unique()
      table.dateTime('expires_at').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
