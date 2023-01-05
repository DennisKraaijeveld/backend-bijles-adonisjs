import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'
import AuthLoginValidator from 'App/Validators/AuthLoginValidator'
import User from 'App/Models/User'
import Tutor from 'App/Models/Tutor'
import Student from 'App/Models/Student'
import { AccountStatus, UserRoles } from 'Contracts/enums'
import GeoLocation from 'App/Helpers/GeoLocation'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthUsersController {
  // Register function
  public async register(ctx: HttpContextContract) {
    const { request, response } = ctx
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

      user.save()

      // We will use an API to get the coordinates from the postal code.
      // This is an API for Dutch Postal Codes and will first verify if the postal code is valid.
      // @TODO: Return correct error message if postal code is invalid from the helper function.

      const geoData = await GeoLocation.getCords(ctx)

      if (geoData) {
        // Create a Point object from the longitude and latitude coordinates
        const location = Database.raw(`ST_MakePoint(?, ?)`, [geoData.longitude, geoData.latitude])

        const tutor = await Tutor.create({ userId: user.id, location })

        await user.related('tutorUser').save(tutor)
      } else {
        return response.unauthorized({ message: { error: 'PostalCode not found' } })
      }

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

      user.save()

      // We will use an API to get the coordinates from the postal code.
      // This is an API for Dutch Postal Codes and will first verify if the postal code is valid.
      // @TODO: Return correct error message if postal code is invalid from the helper function.

      const geoData = await GeoLocation.getCords(ctx)

      if (geoData) {
        // Create a Point object from the longitude and latitude coordinates
        const location = Database.raw(`ST_MakePoint(?, ?)`, [geoData.longitude, geoData.latitude])

        const student = await Student.create({ userId: user.id, location })

        await user.related('studentUser').save(student)
      } else {
        return response.unauthorized({ message: { error: 'PostalCode not found' } })
      }

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

  public async onboardingStatus({ auth, response }: HttpContextContract) {
    // Fetch the authenticated user

    try {
      const user = await auth.use('user').authenticate()

      // Check if the user has completed the onboarding process

      // Perform the onboarding process for the user

      // Return a success response to the client
      return response.status(200).send({ message: 'Onboarding completed successfully' })
    } catch (error) {
      return response.unauthorized({ message: { error: 'Invalid credentials' } })
    }
  }
}
