import axios from 'axios'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'

export default class GeoLocation {
  public static async getCords({ request, response }: HttpContextContract) {
    const validated = await request.validate(AuthValidator)

    const postalCode = validated.postal_code
    const houseNumber = validated.house_number

    if (!postalCode || !houseNumber) {
      return response.unauthorized({ message: { error: 'Missing parameters' } })
    }

    if (postalCode.length < 6) {
      return response.unauthorized({ message: { error: 'Invalid postal code' } })
    }

    const url = `https://sandbox.postcodeapi.nu/v3/lookup/${postalCode}/${houseNumber}`

    const result = await axios({
      method: 'get',
      url: url,
      headers: {
        'x-api-key': process.env.GEOCODING_API_KEY,
      },
    }).catch(function (error) {
      console.log(error)
      return response.unauthorized({ message: { error: error.toJSON() } })
    })

    if (result) {
      return {
        latitude: result?.data?.location.coordinates[0],
        longitude: result?.data?.location.coordinates[1],
      }
    }
  }
}
