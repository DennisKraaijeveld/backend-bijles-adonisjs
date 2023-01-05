import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { AccountStatus, UserRoles } from 'Contracts/enums'

export default class UsersController {
  // Get profile function

  public async getProfile({ auth, response }: HttpContextContract) {
    try {
      const user = await auth.use('user').authenticate()

      const data = await User.query()
        .preload(
          Number(user.userTypeId) === UserRoles.TUTOR ? 'tutorUser' : 'studentUser',
          (query) => {
            query.preload('subjects')
          }
        )
        .where('id', user.id)
        .first()

      // Check if user has active account
      if (
        data?.accountStatus === AccountStatus.INACTIVE ||
        data?.accountStatus === AccountStatus.PENDING
      ) {
        await auth.use('user').revoke()
        return response.unauthorized({
          message: {
            error: 'Account is not verified',
          },
        })
      }

      return response.ok({ message: 'User profile', data })
    } catch (error) {
      return response.unauthorized({ message: { error: 'Invalid credentials' } })
    }
  }

  // Update function
}
