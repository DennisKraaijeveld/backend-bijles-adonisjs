import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PasswordResets extends BaseSchema {
    protected tableName = 'password_resets'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.string('email').index().notNullable()
            table.string('token').index().notNullable()
            table.timestamp('created_at').notNullable()
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}
