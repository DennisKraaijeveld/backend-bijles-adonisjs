import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeSave, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { AccountStatus, UserGender, UserRoles } from 'Contracts/enums'
import Hash from '@ioc:Adonis/Core/Hash'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
// import { nanoid } from 'nanoid'

import Tutor from './Tutor'
import Student from './Student'
import EmailVerificationToken from './EmailVerificationToken'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userTypeId: UserRoles

  @column()
  public email: string

  @column.dateTime({ autoCreate: false })
  public emailVerifiedAt?: DateTime

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public userImage?: string

  @column.dateTime({ autoCreate: false })
  public dateOfBirth: DateTime

  @column()
  public gender: UserGender

  @column()
  public postalCode: string

  @column()
  public accountStatus: AccountStatus

  @column()
  public isAdmin: boolean

  @column()
  public activeSubscription: boolean

  @column()
  public emailNotificationActive: boolean

  @column.dateTime({ autoCreate: true })
  public registrationDate: DateTime

  @column()
  public stripeId?: string

  @column()
  public cardBrand?: string

  @column()
  public cardLastFour?: string

  @column.dateTime({ autoCreate: false })
  public trialEndsAt?: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Tutor)
  public tutorUser: HasOne<typeof Tutor>

  @hasOne(() => Student)
  public studentUser: HasOne<typeof Student>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async createEmailVerificationToken(user: User) {
    const token = '11'

    const data = {
      userId: user.id,
      email: user.email,
      verificationToken: await Hash.make(token),
      expiresAt: DateTime.now().plus({ hours: 24 }).toFormat('yyyy-MM-dd HH:mm:ss'),
    }

    await EmailVerificationToken.create(data)

    const url = Env.get('APP_URL') + `/verify-email?email=${data.email}&token=${token}`

    Mail.send((message) => {
      message
        .from('verifiy@example.com')
        .to(data.email)
        .subject('Welcome! Please verify your email address')
        .htmlView('emails/verify_email', { name: user.firstName, url: url })
    })
  }
}
