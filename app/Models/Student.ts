import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { DateTime } from 'luxon'
import Subject from './Subject'
import { RawBuilderContract } from '@ioc:Adonis/Lucid/Database'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public totalReviews: number

  @column()
  public averageRating: number

  @column()
  public location: string | RawBuilderContract

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Subject, {
    pivotTable: 'student_subjects',
  })
  public subjects: ManyToMany<typeof Subject>
}
