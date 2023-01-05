import OnboardingValidator from 'App/Validators/OnboardingValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class OnboardingController {
  public async updateProfile({ request, response, auth }: HttpContextContract) {
    const user = await auth.use('user').authenticate()

    if (!user) {
      return response.unauthorized({
        message: { error: 'User not found or logged in', id: 'user_not_found' },
      })
    }

    if (user.onboardingCompleted === true) {
      return response.unauthorized({
        message: { error: 'Onboarding already completed', id: 'onboarding_already_completed' },
      })
    }

    if (user.$attributes.userTypeId === '1') {
      const tutor = await user.related('tutorUser').query().first()

      const validated = await request.validate(OnboardingValidator)

      user.userImage = Attachment.fromFile(validated.user_image)
      user.dateOfBirth = validated.date_of_birth
      user.biography = validated.biography
      user.contactNumber = validated.contact_number
      user.onboardingCompleted = true

      user.related('tutorUser').updateOrCreate(
        { userId: user.id },
        {
          hourlyRate: validated.hourly_rate,
        }
      )

      // there is an array with subject ids in the request. We should insert them in the pivot table tutor_subjects.
      const subjectIds = validated.subjects

      await tutor?.related('subjects').attach(subjectIds)

      user.save()
      tutor?.save()

      return response.created({ message: 'User updated successfully', data: user })
    }

    if (user.$attributes.userTypeId === '2') {
      const student = await user.related('studentUser').query().first()

      const validated = await request.validate(OnboardingValidator)

      user.userImage = Attachment.fromFile(validated.user_image)
      user.dateOfBirth = validated.date_of_birth
      user.biography = validated.biography
      user.contactNumber = validated.contact_number
      user.onboardingCompleted = true

      user.save()

      const subjectIds = validated.subjects
      await student?.related('subjects').attach(subjectIds)
      student?.save()

      return response.created({ message: 'User updated successfully', data: user })
    }
  }
}
