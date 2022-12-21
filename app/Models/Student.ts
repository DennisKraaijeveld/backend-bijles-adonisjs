import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { DateTime } from 'luxon'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public subjectId: number

  @column()
  public totalReviews: number

  @column()
  public averageRating: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
