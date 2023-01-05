import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Subjects as allSubjects } from 'Contracts/enums'
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

    this.defer(async (db) => {
      const subjects = Object.values(allSubjects)
      await Promise.all(
        subjects.map((item) => {
          return db.table(this.tableName).insert({
            subject_name: item,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          })
        })
      )
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
