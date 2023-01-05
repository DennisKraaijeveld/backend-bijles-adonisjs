import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class TutorSearchController {
  public async nearbyTutors({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)

    const latitude = 5.46961
    const longitude = 51.841553
    const distance = 10000

    const limit = 25

    const radius = distance / 111.045 // Convert distance to radians

    const tutors = await Database.from('tutors')
      .select(
        '*',
        Database.raw(
          `ST_distancesphere(
          location,
          ST_MakePoint(?, ?)
        ) / 1000 as distance`,
          [longitude, latitude]
        )
      )
      .whereRaw(`ST_distancesphere(location, ST_MakePoint(?, ?)) / 1000 < ?`, [
        longitude,
        latitude,
        radius,
      ])
      .orderBy('distance', 'asc')
      .paginate(page, limit)

    return response.ok({ tutors: tutors })
  }
}
