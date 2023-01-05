import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { AccountStatus, UserGender, UserRoles } from 'Contracts/enums'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).unique().notNullable()
      table.timestamp('email_verified_at').nullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.enum('user_type_id', Object.values(UserRoles)).notNullable()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.json('user_image').nullable().defaultTo(null)
      table.date('date_of_birth').nullable()
      table.string('biography').nullable()
      table.enu('gender', Object.values(UserGender)).notNullable()
      table.string('postal_code').notNullable()
      table.text('contact_number').nullable()
      table
        .enum('account_status', Object.values(AccountStatus))
        .notNullable()
        .defaultTo(AccountStatus.PENDING)
      table.boolean('onboarding_completed').notNullable().defaultTo(false)
      table.boolean('active_subscription').notNullable().defaultTo(false)
      table.boolean('email_notification_active').notNullable().defaultTo(true)
      table.date('registration_date').notNullable()
      table.string('stripe_id').nullable()
      table.string('card_brand').nullable()
      table.string('card_last_four').nullable()
      table.timestamp('trial_ends_at').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
