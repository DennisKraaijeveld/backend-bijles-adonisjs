import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'
import AuthLoginValidator from 'App/Validators/AuthLoginValidator'
import User from 'App/Models/User'
import Tutor from 'App/Models/Tutor'
import Student from 'App/Models/Student'
import { AccountStatus, UserRoles } from 'Contracts/enums'

export default class AuthUsersController {
  // Register function
  public async register({ request, response }: HttpContextContract) {
    // Check for the type of user
    const role = request.only(['user_type_id'])

    const roleNumber = Number(role.user_type_id)

    const user = await User.query().where('email', request.input('email')).first()

    if (user) return response.unauthorized({ message: { error: 'Email already registered' } })

    // Role number 1
    if (roleNumber === UserRoles.TUTOR) {
      const validated = await request.validate(AuthValidator)

      const user = new User()
      user.email = validated.email
      user.password = validated.password
      user.userTypeId = validated.user_type_id
      user.gender = validated.gender
      user.firstName = validated.first_name
      user.lastName = validated.last_name
      user.postalCode = validated.postal_code

      const tutor = new Tutor()

      await user.related('tutorUser').save(tutor)

      user.createEmailVerificationToken(user)

      return response.created({ message: 'User created successfully', data: user })
    }

    // Role number 2
    if (roleNumber === UserRoles.STUDENT) {
      const validated = await request.validate(AuthValidator)

      const user = new User()
      user.email = validated.email
      user.password = validated.password
      user.userTypeId = validated.user_type_id
      user.gender = validated.gender
      user.firstName = validated.first_name
      user.lastName = validated.last_name
      user.postalCode = validated.postal_code

      const student = new Student()

      await user.related('studentUser').save(student)

      user.createEmailVerificationToken(user)

      return response.created({ message: 'User created successfully', data: user })
    }

    return response.unauthorized({ message: { error: 'Invalid user type' } })
  }

  // Login function
  public async login({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(AuthLoginValidator)

    const user = await User.query().where('email', data.email).first()

    if (user?.accountStatus === AccountStatus.PENDING) {
      return response.unauthorized({ message: { error: 'Account not verified' } })
    }

    try {
      const token = await auth.use('user').attempt(data.email, data.password)
      console.log(token)
      return response.ok({ message: 'User logged in successfully', data: token })
    } catch (error) {
      return response.unauthorized({ message: { error: 'Invalid credentials' } })
    }
  }

  // logout function
  public async logout({ auth, response, request }: HttpContextContract) {
    const token = request.headers().authorization

    if (!token) {
      return response.unauthorized({ message: { error: 'No token provided' } })
    }

    await auth.use('user').revoke()

    return response.ok({ message: 'User logged out successfully', revoked: true })
  }
}
