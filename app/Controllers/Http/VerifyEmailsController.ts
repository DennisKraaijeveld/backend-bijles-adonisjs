import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import EmailVerificationToken from 'App/Models/EmailVerificationToken'
import User from 'App/Models/User'
import { AccountStatus } from 'Contracts/enums'

export default class VerifyEmailsController {
  public async verifyEmail({ request, response }: HttpContextContract) {
    const { email, token } = request.only(['email', 'token'])

    const dbToken = await EmailVerificationToken.findBy('email', email)

    if (!dbToken) return response.notFound({ message: 'Token not found' })

    if (!(await Hash.verify(dbToken.verificationToken, token))) {
      return response.badRequest({
        error: 'Invalid token',
      })
    }

    const user = await User.findOrFail(dbToken.userId)

    // Update user account status
    user.accountStatus = AccountStatus.ACTIVE
    await user.save()

    // Delete the token
    await dbToken.delete()

    return response.ok({
      message: 'Email verified',
    })
  }
}
