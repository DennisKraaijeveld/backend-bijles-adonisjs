import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Onboarding {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { auth, response } = ctx

    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const user = await auth.use('user').authenticate()
      if (user.$attributes.onboardingCompleted === false) {
        // It should block the user from accessing other routes until they complete the onboarding process
        response.unauthorized({
          message: { error: 'Onboarding not completed', id: 'onboarding_not_completed' },
        })
      } else {
        await next()
      }
    } catch (error) {
      response.unauthorized({ message: { error: 'Invalid credentials' } })
      await next()
    }
  }
}
