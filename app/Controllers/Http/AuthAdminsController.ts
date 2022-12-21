import Admin from 'App/Models/Admin'
import AuthAdminValidator from 'App/Validators/AuthAdminValidator'
import AuthLoginValidator from 'App/Validators/AuthLoginValidator'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthAdminsController {
  // Register function
  public async register({ request, auth }: HttpContextContract) {
    const data = await request.validate(AuthAdminValidator)

    const admin = await Admin.create(data)

    await auth.use('admin').login(admin)

    // return response message and userData
    return {
      message: 'Admin created successfully',
      admin,
    }
  }
  // Login function
  public async login({ request, auth }: HttpContextContract) {
    const data = await request.validate(AuthLoginValidator)

    const email = request.input('email')
    const password = request.input('password')

    const admin = await Admin.findByOrFail('email', data.email)

    const token = await auth.use('admin').attempt(email, password)

    console.log(token)

    return {
      message: 'admin logged in successfully',
      admin,
    }
  }

  // logout function
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.status(200)
  }
}
